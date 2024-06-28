import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { ServicesDto } from 'src/service/Dto/service.dto';

export class FactureDto {
  @ApiProperty({ description: 'La devise de la facture' })
  totalHT: number;
  @ApiProperty({ description: 'La devise de la facture' })
  totalTVA: number;
  @ApiProperty({ description: 'La devise de la facture' })
  totalRemise: number;
  @ApiProperty({ description: 'La devise de la facture' })
  totalHTApresRemise: number;
  @ApiProperty({ description: 'La devise de la facture' })
  totalTTC: number;
  @ApiProperty({ description: 'La devise de la facture' })
  totalTTCLettre: string;
  @ApiProperty({ description: 'La devise de la facture' })
  @IsMongoId()
  deviseid: string;
  @ApiProperty({ type: [ServicesDto] })
  @IsArray()
  @Type(() => ServicesDto)
  services: ServicesDto[];
  @ApiProperty({ description: 'La devise de la facture' })
  @IsMongoId()
  timbreid: string;
  @ApiProperty({ description: 'La devise de la facture' })
  @IsMongoId()
  clientid: string;
  @ApiProperty({ description: 'La devise de la facture' })
  @IsMongoId()
  parametrageid: string;

  @IsOptional()
  date?: Date;
}
