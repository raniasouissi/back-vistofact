import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TimbreDocument = Timbre & Document;

@Schema({ timestamps: true })
export class Timbre {
  @Prop()
  value: number;
}

export const TimbreSchema = SchemaFactory.createForClass(Timbre);
