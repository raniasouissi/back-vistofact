// auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/models/users.models';
import { SignUpDto } from './Dto/signup.dto';
import { LoginDto } from './Dto/login.dto';
//import * as nodemailer from 'nodemailer';
//import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { SignupWithGpDto } from './Dto/signupwithgp.dto';
//import cryptoRandomString from 'crypto-random-string';
//import { v4 as uuidv4 } from 'uuid';
//import { Response } from 'express';
//import { ResetPasswordDto } from './Dto/resetpass.dto';
import { addSeconds } from 'date-fns';
import { Client } from 'src/client/models/clients.models';
import { Financier } from 'src/financier/models/financier.models';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Client.name)
    private clientModel: Model<Client>,
    @InjectModel(Financier.name)
    private FinancierModel: Model<Financier>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async logout(userId: string): Promise<void> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $unset: { accessToken: 1 } }, // Supprime le champ accessToken de l'utilisateur
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }

  // Fonction de génération de mot de passe
  private generateRandomPassword(length: number): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allCharacters = uppercase + lowercase + numbers + symbols;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let password = '';

    // Générer le mot de passe
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters.charAt(randomIndex);
    }

    // Assurer que le mot de passe généré respecte les critères
    if (!password.match(passwordRegex)) {
      // Régénérer le mot de passe si nécessaire
      return this.generateRandomPassword(length);
    }

    return password;
  }

  // Utilisation de la fonction de génération de mot de passe
  generatedPassword = this.generateRandomPassword(12); // Génère un mot de passe de longueur 12

  async signUpWithGeneratedPassword(
    signUpDto: SignupWithGpDto,
  ): Promise<{ message: string; result: any }> {
    const { name, email, phonenumber, roles } = signUpDto;

    try {
      const temporaryPassword = this.generateRandomPassword(12);

      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const user = await this.FinancierModel.create({
        name,
        email,
        password: hashedPassword,
        phonenumber,
        roles,
      });

      await this.mailerService.sendMail({
        to: email,
        subject: 'Inscription réussie sur Visto Fact',
        html: `<p>Bienvenue ${name},</p>
                <p>Félicitations! Vous avez été inscrit avec succès sur Visto Fact. Voici vos informations d'inscription :</p>
                <ul>
                   
                    <li>Email: ${email}</li>
                    <li>Mot de passe : ${temporaryPassword}</li>
                </ul>
                <p>Connectez-vous avec votre email et le mot de passe . Vous serez invité à le changer après la première connexion.</p>
                <p>L'équipe Visto Fact vous souhaite la bienvenue!</p>`,
      });

      return {
        message:
          'Inscription réussie. Un e-mail a été envoyé avec les informations.',
        result: user,
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw new Error("Une erreur est survenue lors de l'inscription.");
    }
  }

  /*async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const {
      name,
      email,
      password,
      roles,
      address,
      pays,
      phonenumber,
      codepostale,
      matriculeFiscale,
    } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    let userType = 'physique';

    if (matriculeFiscale) {
      userType = 'moral';
    }

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      roles,
      address,
      pays,
      phonenumber,
      codepostale,
      type: userType,
      matriculeFiscale, // Enregistrez le matricule fiscal dans la base de données
    });

    const token = this.jwtService.sign({ id: user._id, roles: user.roles });

    return { token };
  }*/
  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const {
      name,
      email,
      password,
      roles,
      address,
      pays,
      phonenumber,
      codepostale,
      matriculeFiscale,
    } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    let userType = 'client physique';

    if (matriculeFiscale) {
      userType = 'client morale';
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const client = await this.clientModel.create({
      name,
      email,
      password: hashedPassword,
      roles,
      address,
      pays,
      phonenumber,
      codepostale,
      type: userType,
      matriculeFiscale,
      verificationCode,
      verificationCodeExpiration: addSeconds(new Date(), 120), // Code expirera dans 60 secondes
    });

    await this.sendVerificationEmail(client.email, verificationCode);

    // Attendre la vérification de l'e-mail avant de générer le token
    const isVerified = await this.verifyAccount(email, verificationCode);

    if (isVerified) {
      const token = this.jwtService.sign({
        id: client._id,
        roles: client.roles,
      });
      return { token };
    } else {
      // Si la vérification échoue, vous pouvez gérer cela en conséquence
      throw new Error("Échec de la vérification de l'e-mail.");
    }
  }

  async verifyAccount(
    email: string,
    verificationCode: string,
  ): Promise<boolean> {
    const user = await this.clientModel.findOne({
      email,
      verificationCode,
      verificationCodeExpiration: { $gt: new Date() },
    });

    if (user) {
      // Marquer l'utilisateur comme vérifié
      user.isVerified = true;
      await user.save();
      return true;
    } else {
      // Supprimer le compte si la vérification échoue
      await this.clientModel.deleteOne({ email });
      return false;
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: "Vérification d'adresse e-mail",
      html: `
        <p>Bienvenue sur Visto !</p>
        <p>Veuillez utiliser le code suivant pour vérifier votre adresse e-mail :</p>
        <strong>${verificationCode}</strong>
      `,
    });
  }
  async login(loginDto: LoginDto): Promise<{ token: string; user: User }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(
        'Adresse e-mail ou mot de passe incorrect',
      );
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        'Adresse e-mail ou mot de passe incorrect',
      );
    }

    const token = this.jwtService.sign({ id: user._id, roles: user.roles });

    return { token, user };
  }
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return false;
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiration = addSeconds(new Date(), 60);

    user.resetPasswordCode = verificationCode;
    user.resetPasswordCodeExpiration = expiration;

    await user.save();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
    });

    return true;
  }

  async verifyResetCode(email: string, code: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordCodeExpiration: { $gt: new Date() },
    });

    return !!user;
  }

  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return false;
    }

    // Mettez à jour le mot de passe avec le nouveau mot de passe hashé
    user.password = await bcrypt.hash(newPassword, 10);

    // Réinitialisez le code et la date d'expiration
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpiration = null;

    // Sauvegardez les modifications dans la base de données
    await user.save();

    return true;
  }
}
