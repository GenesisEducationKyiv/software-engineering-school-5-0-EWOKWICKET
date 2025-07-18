import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsFacadeInterface } from 'src/facade/interfaces/notifications-facade.interface';

@Controller()
export class NotificationsController {
  constructor(private readonly facade: NotificationsFacadeInterface) {}

  @MessagePattern('send_confirmation_notification')
  async sendConfirmationNotification({ data, type }: { data: ConfirmationNotification; type: NotificationType }) {
    try {
      await this.facade.sendConfirmationNotification(data, type);
    } catch {
      console.log('ERR OCCURED');
    }
  }
  @MessagePattern('send_weather_update_notification')
  async sendWeatherUpdateNotification({ data, type }: { data: WeatherUpdateNotification; type: NotificationType }) {
    try {
      await this.facade.sendWeatherUpdateNotification(data, type);
    } catch {
      console.log('ERR OCCURED');
    }
  }
}
