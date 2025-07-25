import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Injectable } from '@nestjs/common';
import { ConfirmationNotification, WeatherUpdateNotification } from '@proto/notifications';
import { lastValueFrom } from 'rxjs';
import { NotificationsClient } from './interfaces/notifications-client.interface';

@Injectable()
export class NotificationsGrpcClient implements NotificationsClient {
  constructor(private readonly notifications) {}

  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType) {
    await lastValueFrom(this.notifications.sendConfirmationNotification({ data, type }));
  }

  async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType) {
    await lastValueFrom(this.notifications.sendWeatherUpdateNotification({ data, type }));
  }
}
