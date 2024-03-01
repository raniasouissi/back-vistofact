import { User } from 'src/users/models/users.models';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Document } from 'mongoose';
import { Roles } from 'src/auth/enum';

@Schema({ collection: 'users', timestamps: true })
export class Client extends User {
  @Prop()
  name: string;

  @Prop({ default: 'client' }) // Définit le rôle par défaut comme 'user'
  role: Roles;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
