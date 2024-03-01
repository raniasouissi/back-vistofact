import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ClientDto {
  readonly role: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Veuillez entrer une adresse e-mail correcte' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  readonly name: string;
}
