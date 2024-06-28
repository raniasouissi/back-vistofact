import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { Client } from 'src/client/models/clients.models';
import { Devise } from 'src/devise/models/devise.model';
import { Paiement } from 'src/paiement/models/paiement.model';
import { Service } from 'src/service/models/service.model';

export type FactureDocument = Facture & Document;

@Schema({ timestamps: true })
export class Facture {
  @Prop({ required: true, unique: true })
  numeroFacture: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({
    type: Number,
    default: 0,
    get: (v) => parseFloat(v).toFixed(3),
    set: (v) => parseFloat(v).toFixed(3),
  })
  totalHT: number;

  @Prop({
    type: Number,
    default: 0,
    get: (v) => parseFloat(v).toFixed(3),
    set: (v) => parseFloat(v).toFixed(3),
  })
  totalTVA: number;

  @Prop({
    type: Number,
    default: 0,
    get: (v) => parseFloat(v).toFixed(3),
    set: (v) => parseFloat(v).toFixed(3),
  })
  totalRemise: number;

  @Prop({
    type: Number,
    default: 0,
    get: (v) => parseFloat(v).toFixed(3),
    set: (v) => parseFloat(v).toFixed(3),
  })
  totalHTApresRemise: number;

  @Prop({
    type: Number,
    default: 0,
    get: (v) => parseFloat(v).toFixed(3),
    set: (v) => parseFloat(v).toFixed(3),
  })
  totalTTC: number;

  @Prop({ type: String }) // Ajout du champ pour le total TTC en lettres
  totalTTCLettre: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Devise' }) // Utilise une référence au modèle de devise
  devise: Devise;

  @Prop({ type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Service' }] }) // Utilisez SchemaTypes.ObjectId
  services: Service[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Timbre' })
  timbre: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Parametrage' })
  parametrage: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date })
  dateEcheance: Date;

  static async generateNumeroFacture(
    model: Model<FactureDocument>,
  ): Promise<string> {
    const currentYear = new Date().getFullYear().toString();
    const lastFacture = await model
      .findOne({ numeroFacture: new RegExp(`^Fact  \\d+ ${currentYear}`) })
      .sort({ numeroFacture: -1 });

    let lastNumber = 0;
    if (lastFacture) {
      const lastFactureNumber = lastFacture.numeroFacture.split(' ')[2]; // Récupère le dernier numéro de facture
      lastNumber = parseInt(lastFactureNumber);
    }

    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
    return `Fact  ${nextNumber} ${currentYear}`;
  }

  @Prop({ type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Paiement' }] })
  paiemnts: Paiement[]; // Référence vers le modèle de facture
}

export const FactureSchema = SchemaFactory.createForClass(Facture);
