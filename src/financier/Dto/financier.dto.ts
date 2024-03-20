import { IsEmail, IsString, MinLength } from 'class-validator';

export class FinancierDto {
  @MinLength(2)
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  phonenumber: string;
}
