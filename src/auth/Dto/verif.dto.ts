import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly verificationCode: string;
}
