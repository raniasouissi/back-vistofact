import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EcheanceDto } from 'src/echeance/Dto/echenace.dto';

export class PaiementDto {
  @IsString()
  etatpaiement: string;

  @IsNumber()
  @IsOptional()
  montantPaye: number;

  @IsString()
  typepaiement: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  datepaiement: Date;

  @IsMongoId()
  factures: string;

  @Type(() => EcheanceDto)
  echeances: EcheanceDto[];
}
