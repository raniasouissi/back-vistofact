// tva.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TvaDocument = Tva & Document;

@Schema({ timestamps: true })
export class Tva {
  // Utilisez la méthode de transformation pour formater le taux de TVA avec ".00"
  @Prop({
    unique: [true, 'Duplicate Pourcent_TVA entered'],
    get: (value: number) => `${value.toFixed(2)}`,
  })
  rate: number;

  @Prop({ default: true })
  status: boolean;
}

export const TvaSchema = SchemaFactory.createForClass(Tva);
