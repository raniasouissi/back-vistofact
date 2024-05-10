import { Client } from 'src/client/models/clients.models';

import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ServiceDocument = Service & mongoose.Document;

@Schema()
export class Service {
  @Prop()
  reference: string;
  @Prop({ type: String })
  libelle: string;

  @Prop({ type: Number })
  quantite: number;

  @Prop({ type: Number })
  prix_unitaire: number;
  @Prop({ type: Number })
  montant_HT: number;
  @Prop({ type: Number })
  montant_TTC: number;
  // @Prop({ type: String, ref: 'Client' }) // Définissez la relation avec le client
  // clientId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tva',
  })
  tva: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Devise',
  })
  devise: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',
  })
  categories: mongoose.Schema.Types.ObjectId;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
