import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

// Dans votre DTO de mise à jour du service
export class UpdateServiceDto {
  @IsNumber()
  @IsOptional()
  prix_unitaire?: number;
  montant_ht?: number;

  @IsNumber()
  @IsOptional()
  remise?: number;

  @IsNumber()
  @IsOptional()
  quantite?: number;

  @IsMongoId()
  @IsOptional()
  tvaId?: string = null; // TVA par défaut à null
}
