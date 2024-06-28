import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class EcheanceDto {
  @IsNumber()
  @IsOptional()
  numCheque?: number;

  @IsNumber()
  @IsOptional()
  montantCheque?: number;

  @IsDate()
  dateCh?: Date;

  @IsDate()
  @IsOptional()
  dateEcheance?: Date;
}
