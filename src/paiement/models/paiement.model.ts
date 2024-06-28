import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Echeance } from 'src/echeance/models/echeance.model';
import { Facture } from 'src/facture/models/facture.model';

export type PaiementDocument = Paiement & Document;

@Schema({ timestamps: true })
export class Paiement {
  @Prop({ type: String, default: 'Non payé' }) // Valeur par défaut pour statusDelai
  etatpaiement: string;

  @Prop({ type: Number, default: null }) // Valeur par défaut pour montantPaye
  montantPaye: number;

  @Prop({ type: String }) // Valeur par défaut pour statusDelai
  typepaiement: string;

  @Prop({ type: Date, default: Date.now })
  datepaiement: Date;

  @Prop({ type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Facture' }] })
  factures: Facture[]; // Référence vers le modèle de facture

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Echeance' }] })
  echeances: Echeance[]; // Référence à plusieurs échéances
}

export const PaiementSchema = SchemaFactory.createForClass(Paiement);
