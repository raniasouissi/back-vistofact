import { User } from 'src/users/models/users.models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
//import { Roles } from 'src/auth/enum';

@Schema({ collection: 'users', timestamps: true })
export class Financier extends User {
  @Prop()
  phonenumber: string;
}

export type FinancierDocument = Financier & Document;
export const FinancierSchema = SchemaFactory.createForClass(Financier);
