// signup-with-gp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class SignupWithGpDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsArray()
  roles: string[];
  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  pays?: string;
  @ApiProperty()
  phonenumber: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly codepostale?: string;

  readonly status: boolean = true;
}
