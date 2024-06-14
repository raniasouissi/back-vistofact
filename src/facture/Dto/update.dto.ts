import { IsOptional } from 'class-validator';

export class UpdateFactureDto {
  @IsOptional()
  dateEcheance?: Date;

  @IsOptional()
  statusDelai?: string;

  @IsOptional()
  montantPaye?: number;

  @IsOptional()
  montantRestant?: number;

  @IsOptional()
  delai?: number;

  @IsOptional()
  etatpaiement?: string;

  @IsOptional()
  nombreJoursRetard?: number;

  @IsOptional()
  datejour?: Date;

  @IsOptional()
  date?: Date; // Notez le ? pour indiquer que la propriété est facultative
  @IsOptional()
  totalTTC: number;
}
