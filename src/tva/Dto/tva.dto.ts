// tva.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTvaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  rate: number;
}
