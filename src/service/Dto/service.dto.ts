import { IsString, IsNumber, IsMongoId, IsNotEmpty } from 'class-validator';

export class ServicesDto {
  @IsString()
  @IsNotEmpty()
  libelle: string;
  reference: string;

  @IsNumber()
  quantite: number;

  @IsNumber()
  prix_unitaire: number;
  montant_HT: number;
  montant_TTC: number;
  @IsMongoId()
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  tvaId: string;

  @IsMongoId()
  @IsNotEmpty()
  deviseId: string;

  @IsMongoId()
  @IsNotEmpty()
  categoriesId: string;
}
