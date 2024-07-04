import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './models/notification.model';

import { CreateNotifDto } from './dto/notification.dto';
import { Client } from 'src/client/models/clients.models';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(createNotificationDto: CreateNotifDto): Promise<Notification> {
    const { client: clientId, ...notificationData } = createNotificationDto;

    // Vérifier si le client existe
    const existingClient = await this.clientModel.findById(clientId);
    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Créer la notification
    const notification = new this.notificationModel({
      ...notificationData,
      client: existingClient._id, // Assurez-vous de stocker l'ID du client existant
    });

    await notification.save();

    // Mettre à jour les notifications du client
    await this.clientModel.findByIdAndUpdate(existingClient._id, {
      $push: { notifications: notification._id },
    });

    return notification;
  }

  async findNotificationsByClientId(clientId: string): Promise<Notification[]> {
    return this.notificationModel.find({ client: clientId }).exec();
  }

  async deleteNotificationById(notificationId: string): Promise<void> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }

    const clientId = notification.client;

    await this.notificationModel.findByIdAndDelete(notificationId);

    // Mettre à jour les notifications du client
    await this.clientModel.findByIdAndUpdate(clientId, {
      $pull: { notifications: notificationId },
    });
  }
}
