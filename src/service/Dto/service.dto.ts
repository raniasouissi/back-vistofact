import { IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNumber()
  reference: number;

  @IsString()
  libelle: string;

  @IsNumber()
  quantite: number;

  @IsNumber()
  prix_unitaire: number;

  @IsNumber()
  montant_HT: number;

  clientId: string;
}
