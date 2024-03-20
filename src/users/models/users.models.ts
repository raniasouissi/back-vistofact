// users.models.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { IsOptional } from 'class-validator';
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
  @Prop({ default: null })
  verificationCode: string;

  @Prop({ default: null })
  verificationCodeExpiration: Date;
  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
