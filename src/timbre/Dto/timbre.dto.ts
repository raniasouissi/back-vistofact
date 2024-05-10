import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTimbreDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;
}

export class UpdateTimbreDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
