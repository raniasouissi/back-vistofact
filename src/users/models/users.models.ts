// users.models.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from 'src/auth/enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phonenumber?: string;

  @Prop()
  pays?: string;

  @Prop() // Adresse spécifique au client
  address?: string;

  @Prop() // Adresse spécifique au client
  codepostale?: string;

  @Prop({ required: true, type: [String], enum: Object.values(Roles) })
  roles: Roles[];

  @Prop({ default: '' })
  resetPasswordToken: string;

  @Prop()
  resetPasswordCode: string;

  @Prop()
  resetPasswordCodeExpiration: Date;

  @Prop({ default: null })
  temporaryPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
