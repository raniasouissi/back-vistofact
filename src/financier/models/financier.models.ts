import { User } from 'src/users/models/users.models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from 'src/auth/enum';

@Schema({ collection: 'users', timestamps: true })
export class Financier extends User {
  @Prop()
  phoneNumber: string;

  @Prop()
  name: string;

  @Prop({ default: 'financier' }) // Définit le rôle par défaut comme 'financier'
  role: Roles;
}

export type FinancierDocument = Financier & Document;
export const FinancierSchema = SchemaFactory.createForClass(Financier);
