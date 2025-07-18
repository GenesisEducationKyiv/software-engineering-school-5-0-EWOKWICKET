import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfirmationNotification, WeatherUpdateNotification } from '@proto/notifications';
import { lastValueFrom } from 'rxjs';
import { NotificationsClient } from './interfaces/notifications-client.interface';

@Injectable()
export class NotificationsGrpcClient implements NotificationsClient, OnModuleInit {
  private notifications;

  constructor(@Inject('NOTIFICATIONS') private readonly notificationsClient: ClientGrpc) {}

  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType) {
    await lastValueFrom(this.notifications.sendConfirmationNotification({ data, type }));
  }

  async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType) {
    await lastValueFrom(this.notifications.sendWeatherUpdateNotification({ data, type }));
  }

  onModuleInit() {
    this.notifications = this.notificationsClient.getService('NotificationsService');
  }
}
