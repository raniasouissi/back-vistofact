import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EcheanceDocument = Echeance & Document;

@Schema({ timestamps: true })
export class Echeance {
  @Prop({ type: Number, default: null }) // Montant payé
  numCheque: number;

  @Prop({ type: Number, default: null }) // Montant payé
  montantCheque: number;

  @Prop({ type: Date, default: Date.now }) // Date de paiement
  dateCh: Date;

  @Prop({ type: Date, default: null }) // Date d'échéance
  dateEcheance: Date;
}

export const EcheanceSchema = SchemaFactory.createForClass(Echeance);
