import { IsNotEmpty, IsString } from 'class-validator';

export class ParametrageDto {
  @IsNotEmpty()
  @IsString()
  identreprise: string; // Laisser vide dans la DTO, MongoDB se chargera de le générer automatiquement

  @IsNotEmpty()
  @IsString()
  matriculefiscal: string;

  @IsNotEmpty()
  @IsString()
  pays: string;

  @IsNotEmpty()
  @IsString()
  nomEntreprise: string;

  @IsNotEmpty()
  @IsString()
  adresseEntreprise: string;

  @IsNotEmpty()
  @IsString()
  ville: string;

  @IsNotEmpty()
  @IsString()
  codePostal: string;
  @IsNotEmpty()
  @IsString()
  tva: string;
  phonenumber: string;
}
