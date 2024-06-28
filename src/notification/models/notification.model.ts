import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Client } from 'src/client/models/clients.models';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    required: true,
    enum: [
      'FactureCréée',
      'PaiementRéglé',
      'DevisClientNotif',
      'DevisFinNotif',
    ],
  })
  type: 'FactureCréée' | 'PaiementRéglé' | 'DevisClientNotif' | 'DevisFinNotif';

  @Prop({ required: true })
  notif: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
