import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategorieDto {
  @IsNotEmpty()
  @IsString()
  titre: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateCategorieDto {
  @IsString()
  titre: string;

  @IsString()
  description: string;
}
