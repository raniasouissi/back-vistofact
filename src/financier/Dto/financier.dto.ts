import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class FinancierDto {
  @ApiProperty()
  @MinLength(2)
  @IsString()
  name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  phonenumber: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly address?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly codepostale?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly pays?: string;
}
