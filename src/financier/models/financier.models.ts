import { User } from 'src/users/models/users.models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
//import { Roles } from 'src/auth/enum';

@Schema({ collection: 'users', timestamps: true })
export class Financier extends User {
  @Prop()
  phonenumber: string;
  @Prop({ default: null, type: String })
  pays?: string;

  @Prop({ default: null, type: String }) // Adresse spécifique au client
  address?: string;

  @Prop({ default: null, type: String }) // Adresse spécifique au client
  codepostale?: string;
  @Prop({ default: null }) // Par défaut, le resetToken est null
  resetToken: string;
}

export type FinancierDocument = Financier & Document;
export const FinancierSchema = SchemaFactory.createForClass(Financier);
