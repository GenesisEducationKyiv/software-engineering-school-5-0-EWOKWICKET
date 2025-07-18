import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Notification } from '@common/contracts/notifications/constants/notifications.type';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotificationsClient } from './interfaces/notifications-client.interface';

@Injectable()
export class NotificationsMessageClient implements NotificationsClient {
  constructor(@Inject('NOTIFICATIONS') private readonly notifications: ClientProxy) {}
  async notify(data: Notification, type: NotificationType) {
    await firstValueFrom(this.notifications.emit('send_notification', { data, type }));
  }
  // async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType) {
  //   await this.notifications.sendConfirmationNotification({ data, type });
  // }

  // async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType) {
  //   await this.notifications.sendWeatherUpdateNotification({ data, type });
  // }
}
