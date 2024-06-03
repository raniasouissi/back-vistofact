// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  ValidationPipe,
  UsePipes,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SignUpDto } from './Dto/signup.dto';
import { LoginDto } from './Dto/login.dto';
import { AuthService } from './auth.service';
//import { ResetPasswordDto } from './Dto/resetpass.dto';
//import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as Cookie from 'cookie';
import { User } from 'src/users/models/users.models';
import { SignupWithGpDto } from './Dto/signupwithgp.dto';
import { VerifyDto } from './Dto/verif.dto';
//import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  res: any;
  constructor(private authService: AuthService) {}

  //d @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @Post('signup-with-generated-password')
  @HttpCode(201)
  async signUpWithGeneratedPassword(
    @Body() signupDto: SignupWithGpDto,
  ): Promise<{ message: string; result: any }> {
    const { result } =
      await this.authService.signUpWithGeneratedPassword(signupDto);
    return {
      message: 'Inscription réussie avec mot de passe généré automatiquement',
      result,
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<{ token: string; reference: string }> {
    try {
      const { token, reference } = await this.authService.signUp(signUpDto);

      const cookieValue = Cookie.serialize('AuthenticationToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      });

      // Set the cookie
      res.setHeader('Set-Cookie', cookieValue);

      return { token, reference };
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        // Erreur de clé dupliquée, l'adresse e-mail existe déjà
        throw new HttpException(
          "L'adresse e-mail est déjà utilisée.",
          HttpStatus.CONFLICT,
        );
      }

      // Gérer les autres erreurs
      throw new HttpException(
        "Une erreur s'est produite lors de l'inscription.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verify')
  async verifyAccount(
    @Body() Verifydto: VerifyDto,
  ): Promise<{ success: boolean; message?: string }> {
    const { email, verificationCode } = Verifydto;

    const isVerified = await this.authService.verifyAccount(
      email,
      verificationCode,
    );

    if (isVerified) {
      return { success: true };
    } else {
      return {
        success: false,
        message:
          'Le code de vérification est incorrect ou a expiré. Veuillez réessayer.',
      };
    }
  }

  @Post('resend-verification-code')
  async resendVerificationCode(
    @Body('email') email: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await this.authService.resendVerificationCode(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de l'envoi du code de vérification.",
      };
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: User }> {
    const { token, user } = await this.authService.login(loginDto);

    return { token, user };
  }

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    try {
      // Supprimer le cookie en définissant sa date d'expiration dans le passé
      res.clearCookie('AuthenticationToken');
      res
        .status(HttpStatus.OK)
        .json({ message: 'Utilisateur déconnecté avec succès' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erreur lors de la déconnexion' });
    }
  }

  @Post('send-password-reset-email')
  @HttpCode(200)
  async sendPasswordResetEmail(@Body('email') email: string): Promise<any> {
    const success = await this.authService.sendPasswordResetEmail(email);

    if (success) {
      return {
        message: 'Email de réinitialisation du mot de passe envoyé avec succès',
      };
    } else {
      return { message: 'Adresse e-mail non trouvée ' };
    }
  }
  @Post('verify-reset-code')
  @HttpCode(200)
  async verifyResetCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<any> {
    const isValidCode = await this.authService.verifyResetCode(email, code);

    if (isValidCode) {
      return { success: true, message: 'Le code est valide' };
    } else {
      return { success: false, message: 'Code invalide ou expiré' };
    }
  }

  @Post('resend-password-reset-code')
  @HttpCode(200)
  async resendPasswordResetCode(@Body('email') email: string): Promise<any> {
    const success = await this.authService.resendPasswordResetCode(email);

    if (success) {
      return {
        message:
          'Un nouveau code de réinitialisation du mot de passe a été envoyé',
      };
    } else {
      return { message: 'Email non trouvé ' };
    }
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    const success = await this.authService.resetPassword(email, newPassword);

    if (success) {
      return {
        message: 'Réinitialisation du mot de passe réussie',
      };
    } else {
      return {
        message: 'Email invalide ou réinitialisation du mot de passe échouée',
      };
    }
  }
}
