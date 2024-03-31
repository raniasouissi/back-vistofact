import { Client } from 'src/client/models/clients.models';
// service.models.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ServiceDocument = Service & mongoose.Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ type: Number, required: true })
  reference: number;

  @Prop({ type: String, required: true })
  libelle: string;

  @Prop({ type: Number, required: true })
  quantite: number;

  @Prop({ type: Number, required: true })
  prix_unitaire: number;

  @Prop({ type: Number, required: true })
  montant_HT: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }) // Relation avec la table Client
  client: Client; // Utilisez ClientDocument pour la référence

  // Si vous avez besoin de plus de champs ou de méthodes, vous pouvez les ajouter ici
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
