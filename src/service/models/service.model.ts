import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Devise } from 'src/devise/models/devise.model';
import { Tva } from 'src/tva/models/tva.model';

export type ServiceDocument = Service & mongoose.Document;

@Schema()
export class Service {
  @Prop()
  reference: string;

  @Prop({ type: String })
  libelle: string;

  @Prop({ type: Number })
  prix_unitaire: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Devise', default: null }) // Utilise une référence au modèle de devise
  devise: Devise;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',
    default: null,
  })
  categories: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 }) // Remise par défaut à null
  remise: number;

  @Prop({ default: 0 }) // Quantité par défaut à null
  quantite: number;

  @Prop({ default: 0 }) // Montant HT par défaut à null
  montant_ht: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tva', default: null }) // Référence au modèle TVA
  tva: Tva;
  @Prop({ default: true })
  status: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
