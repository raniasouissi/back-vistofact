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
import { randomBytes } from 'crypto';

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

  async signUpWithGeneratedPassword(
    signUpDto: SignupWithGpDto,
  ): Promise<{ message: string; result: any }> {
    const { name, email, phonenumber, roles, codepostale, address, pays } =
      signUpDto;

    try {
      const temporaryPassword = randomBytes(8).toString('hex');

      // Hacher le mot de passe temporaire
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Générer un token pour le lien de réinitialisation du mot de passe
      const token = randomBytes(32).toString('hex');

      const user = await this.FinancierModel.create({
        name,
        email,
        password: hashedPassword,
        phonenumber,
        roles,
        codepostale,
        address,
        pays,
        resetToken: token,
      });
      await this.sendSetPasswordEmail(email, token, name);

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
  async sendSetPasswordEmail(
    email: string,
    token: string,
    name: string,
  ): Promise<void> {
    const setPasswordLink = `http://localhost:3000/set-password/${token}`;

    // Envoyer un e-mail au client avec le lien pour définir le mot de passe
    await this.mailerService.sendMail({
      to: email,
      subject: 'Définition du mot de passe',
      html: `
        <p>Bonjour ${name},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe sur VBill.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour définir votre nouveau mot de passe :</p>
        <p><a href="${setPasswordLink}">Définir le mot de passe</a></p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        <p>Cordialement,<br/>L'équipe VBill </p>
      `,
    });
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
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; reference: string }> {
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
      namecompany,
    } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    let userType = 'client physique';

    if (matriculeFiscale) {
      userType = 'client morale';
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Générer un nombre aléatoire entre 1000 et 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    // Générer la référence en concaténant les trois premières lettres du nom de la société avec le nombre aléatoire
    const reference =
      namecompany.substring(0, 3).toUpperCase() + randomNumber.toString();

    await this.clientModel.create({
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

      namecompany,
      reference,
    });

    // Envoi de l'e-mail de vérification
    await this.sendVerificationEmail(email, verificationCode);
    // Retourner à la fois le token et la référence
    return { token: 'token', reference }; // Remplacez 'token' par le token réel que vous générez
  }

  async verifyAccount(
    email: string,
    verificationCode: string,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ email, verificationCode });

    if (user) {
      // Marquer l'utilisateur comme vérifié
      user.isVerified = true;
      await user.save();
      return true;
    }
    return false;
  }

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: "Vérification d'adresse e-mail",
      html: `
        <p>Bienvenue sur VBill !</p>
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
      return false; // L'utilisateur n'existe pas
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
      subject: 'réinitialisation de mot de passe',
      html: `<p>  Code de vérification : <strong>${verificationCode}</strong></p>`,
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

  async resendPasswordResetCode(email: string): Promise<boolean> {
    // Générez un nouveau code
    const newVerificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const newExpiration = addSeconds(new Date(), 60); // 60 secondes pour le nouveau code

    // Enregistrez le nouveau code et la date d'expiration dans la base de données
    await this.userModel.updateOne(
      { email },
      {
        resetPasswordCode: newVerificationCode,
        resetPasswordCodeExpiration: newExpiration,
      },
    );

    // Envoyez le nouveau code par e-mail
    await this.mailerService.sendMail({
      to: email,
      subject: 'Nouveau code de réinitialisation de mot de passe',
      html: `<p>Votre nouveau code de vérification est : <strong>${newVerificationCode}</strong></p>`,
    });

    return true; // Retourne true car un nouveau code a été envoyé
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
