// reset-password.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
