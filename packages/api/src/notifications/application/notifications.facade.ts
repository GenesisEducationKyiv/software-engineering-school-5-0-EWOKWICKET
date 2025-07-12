import { Injectable } from '@nestjs/common';
import { NotificationsFacadeInterface } from 'src/common/interfaces/notifications-facade.interface';
import { NotificationType } from '../../common/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from './constants/notification.type';
import { NotificationsServiceInterface } from './interfaces/notifications-service.abstract';

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
