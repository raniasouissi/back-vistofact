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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async logout(userId: string): Promise<void> {
    // Utilisez l'ID pour déconnecter l'utilisateur
    const user: User = await this.userModel.findByIdAndUpdate(
      userId,
      { $unset: { accessToken: 1 } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }

  private generateRandomPassword(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  }

  async signUpWithGeneratedPassword(
    signUpDto: SignupWithGpDto,
  ): Promise<{ message: string; result: any }> {
    const { name, email, roles, address, pays, phonenumber } = signUpDto;

    try {
      const temporaryPassword = this.generateRandomPassword(12);

      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        roles,
        address,
        pays,
        phonenumber,
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

  // Dans authservice
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
    } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      roles,
      address,
      pays,
      phonenumber,
      codepostale,
    });

    const token = this.jwtService.sign({ id: user._id, roles: user.roles });

    return { token };
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

    // Définissez la date d'expiration du code de vérification
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24); // Expiration en 48 heures

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

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordCodeExpiration: { $gt: new Date() }, // Vérifie si le code est encore valide
    });

    if (!user) {
      return false;
    }

    // Mise à jour du mot de passe et réinitialisation du code
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpiration = null;

    await user.save();

    return true;
  }
}
