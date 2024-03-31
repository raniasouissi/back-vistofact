import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class FinancierDto {
  @MinLength(2)
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  phonenumber: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly codepostale?: string;

  @IsOptional()
  @IsString()
  readonly pays?: string;
}
