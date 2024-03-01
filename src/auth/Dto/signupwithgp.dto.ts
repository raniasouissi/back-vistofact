// signup-with-gp.dto.ts
import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class SignupWithGpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsArray()
  roles: string[];

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  pays?: string;

  @IsOptional()
  @IsString()
  phonenumber?: string;
}
