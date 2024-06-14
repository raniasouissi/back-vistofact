import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParametrageDocument = Parametrage & Document;

@Schema({ timestamps: true })
export class Parametrage {
  @Prop({ default: generateIdentEntreprise }) // Utilisation d'une fonction pour générer l'identifiant d'entreprise
  identreprise: string;

  @Prop()
  matriculefiscal: string;

  @Prop()
  pays: string;

  @Prop()
  nomEntreprise: string;

  @Prop()
  adresseEntreprise: string;

  @Prop()
  ville: string;

  @Prop()
  codePostal: string;

  @Prop()
  phonenumber: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({ default: true })
  status: boolean;
}

export const ParametrageSchema = SchemaFactory.createForClass(Parametrage);

// Fonction pour générer l'identifiant de l'entreprise
function generateIdentEntreprise() {
  const nomEntreprise = this.nomEntreprise;
  const threeLetters = nomEntreprise.substring(0, 3).toUpperCase();
  const randomNumber = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${threeLetters}${randomNumber}`;
}
