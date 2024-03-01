// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Res,
  ValidationPipe,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './Dto/signup.dto';
import { LoginDto } from './Dto/login.dto';
import { AuthService } from './auth.service';
//import { ResetPasswordDto } from './Dto/resetpass.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as Cookie from 'cookie';
import { User } from 'src/users/models/users.models';
import { SignupWithGpDto } from './Dto/signupwithgp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('jwt'))
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ token: string }> {
    const { token } = await this.authService.signUp(signUpDto);

    const cookieValue = Cookie.serialize('AuthenticationToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookieValue);

    return { token };
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ token: string; user: User }> {
    const { token, user } = await this.authService.login(loginDto);

    const cookieValue = Cookie.serialize('AuthenticationToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookieValue);

    return { token, user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout/:id')
  async logout(
    @Param('id') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.authService.logout(userId);
      res.status(200).json({ message: 'Utilisateur déconnecté avec succès' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      } else {
        res.status(500).json({ error: 'Erreur lors de la déconnexion' });
      }
    }
  }

  @Post('send-password-reset-email')
  @HttpCode(200)
  async sendPasswordResetEmail(@Body('email') email: string): Promise<any> {
    const success = await this.authService.sendPasswordResetEmail(email);

    if (success) {
      return { message: 'Password reset email sent successfully' };
    } else {
      return { message: 'Email not found' };
    }
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    const success = await this.authService.resetPassword(
      email,
      code,
      newPassword,
    );

    if (success) {
      return { message: 'Password reset successful' };
    } else {
      return { message: 'Invalid or expired code' };
    }
  }
}
