import { User } from 'src/users/models/users.models';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Facture } from 'src/facture/models/facture.model';
import mongoose from 'mongoose';
//import { Document } from 'mongoose';
//import { Roles } from 'src/auth/enum';

@Schema({ collection: 'users', timestamps: true })
export class Client extends User {
  @Prop()
  phonenumber?: string;

  @Prop({ default: null, type: String })
  pays?: string;

  @Prop({ default: null, type: String }) // Adresse spécifique au client
  address?: string;

  @Prop({ default: null, type: String }) // Adresse spécifique au client
  codepostale?: string;
  @Prop({
    default: 'client physique',
    enum: ['client physique', 'client morale'],
  })
  type: string;
  @Prop({ default: null, type: String })
  @IsOptional() // Rend le champ facultatif lors de la validation
  matriculeFiscale?: string;
  @Prop({ default: null }) // Par défaut, le resetToken est null
  resetToken: string;

  @Prop()
  namecompany: string; // Nouvel attribut namecompany

  @Prop()
  reference: string;

  @Prop({ default: null })
  image: string;
  @Prop({ default: true })
  status: boolean;

  @Prop({ type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Facture' }] })
  factures: Facture[]; // Référence vers le modèle de facture
}

export const ClientSchema = SchemaFactory.createForClass(Client);
