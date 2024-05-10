import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Devise {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true }) // Ajoutez le champ par défaut pour le taux de change
  symbole: string;
}

export type DeviseDocument = Devise & Document;
export const DeviseSchema = SchemaFactory.createForClass(Devise);
