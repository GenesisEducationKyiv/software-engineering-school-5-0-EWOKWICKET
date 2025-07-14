import { Injectable } from '@nestjs/common';
import { NotificationType } from 'src/common/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '../application/constants/notification.type';
import { NotificationsServiceInterface } from '../application/interfaces/notifications-service.abstract';
import { NotificationsFacadeInterface } from './interfaces/notifications-facade.interface';

@Injectable()
export class NotificationsFacade implements NotificationsFacadeInterface {
  constructor(private readonly notificationsService: NotificationsServiceInterface) {}

  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void> {
    await this.notificationsService.sendConfirmationNotification(data, type);
  }

  async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void> {
    await this.notificationsService.sendWeatherUpdateNotification(data, type);
  }
}
