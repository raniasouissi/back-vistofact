import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategorieDocument = Categorie & Document;

@Schema({ timestamps: true })
export class Categorie {
  @Prop()
  titre: string;

  @Prop()
  description: string;
}

export const CategorieSchema = SchemaFactory.createForClass(Categorie);
