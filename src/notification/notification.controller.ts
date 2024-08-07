import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './models/notification.model';
import { CreateNotifDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotifDto,
  ): Promise<Notification> {
    return this.notificationService.create(createNotificationDto);
  }

  @Get(':clientId')
  async findNotificationsByClientId(
    @Param('clientId') clientId: string,
  ): Promise<Notification[]> {
    return this.notificationService.findNotificationsByClientId(clientId);
  }

  @Delete(':id')
  async deleteNotificationById(@Param('id') id: string): Promise<void> {
    await this.notificationService.deleteNotificationById(id);
  }
}
