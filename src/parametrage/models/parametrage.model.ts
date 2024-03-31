import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParametrageDocument = Parametrage & Document;

@Schema({ timestamps: true })
export class Parametrage {
  @Prop({ default: () => new Date().getTime().toString() }) // Utilisation de la date actuelle en millisecondes comme ID
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
  tva: string;
  @Prop()
  phonenumber: string;
}

export const ParametrageSchema = SchemaFactory.createForClass(Parametrage);
