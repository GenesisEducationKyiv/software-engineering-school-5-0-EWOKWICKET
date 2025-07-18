import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotificationsClient } from './interfaces/notifications-client.interface';

@Injectable()
export class NotificationsMessageClient implements NotificationsClient {
  constructor(@Inject('NOTIFICATIONS') private readonly notifications: ClientProxy) {}
  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType) {
    await firstValueFrom(this.notifications.emit('send_confirmation_notification', { data, type }));
  }

  async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType) {
    await firstValueFrom(this.notifications.emit('send_weather_update_notification', { data, type }));
  }
}
