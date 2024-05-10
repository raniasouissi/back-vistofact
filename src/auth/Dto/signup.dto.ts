// signup.dto.ts
import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from '../enum';

export class SignUpDto {
  @IsArray()
  @IsNotEmpty()
  readonly roles: Roles[];

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly codepostale?: string;

  @IsOptional()
  @IsString()
  readonly pays?: string;

  @IsOptional()
  @IsString()
  readonly phonenumber?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Veuillez saisir une adresse e-mail correcte' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  readonly password: string;
  @IsOptional()
  @IsString()
  readonly matriculeFiscale?: string;
  @IsEmpty()
  readonly verificationCode: string;

  @IsString()
  readonly namecompany: string;
}
