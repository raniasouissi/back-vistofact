import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class ServicesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  libelle: string;
  @ApiProperty()
  @IsString()
  reference: string;
  @ApiProperty()
  @IsNumber()
  prix_unitaire: number;
  montant_ht: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  remise?: number = null; // Remise par défaut à null
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quantite?: number = null; // Quantité par défaut à null
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  deviseId?: string = null;
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  categoriesId?: string = null;
  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  tva?: string = null; // TVA par défaut à null

  @IsString()
  @IsNotEmpty()
  unite: string;

  readonly status: boolean = true;
}
