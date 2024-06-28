import { IsNotEmpty, IsString } from 'class-validator';

export class ParametrageDto {
  matriculefiscal?: string;

  @IsNotEmpty()
  @IsString()
  pays: string;

  @IsNotEmpty()
  @IsString()
  nomEntreprise: string;

  @IsNotEmpty()
  @IsString()
  adresseEntreprise: string;

  email: string;

  @IsNotEmpty()
  @IsString()
  ville: string;

  @IsNotEmpty()
  @IsString()
  codePostal: string;
  @IsNotEmpty()
  phonenumber: string;

  readonly status: boolean = true;
}
