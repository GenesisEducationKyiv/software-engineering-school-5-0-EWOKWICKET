import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsFacadeInterface } from 'src/facade/interfaces/notifications-facade.interface';

@Controller()
export class NotificationsController {
  constructor(private readonly facade: NotificationsFacadeInterface) {}

  @MessagePattern('notifications.send_confirmation')
  async sendConfirmationNotification(@Payload() { data, type }: { data: ConfirmationNotification; type: NotificationType }) {
    try {
      await this.facade.sendConfirmationNotification(data, type);
      return { status: 'ok' };
    } catch {
      console.log('ERR OCCURED');
    }
  }

  @MessagePattern('notifications.send_weather_update')
  async sendWeatherUpdateNotification(@Payload() { data, type }: { data: WeatherUpdateNotification; type: NotificationType }) {
    try {
      await this.facade.sendWeatherUpdateNotification(data, type);
      return { status: 'ok' };
    } catch {
      console.log('ERR OCCURED');
    }
  }

  @MessagePattern('notifications.*')
  async handle() {
    console.log('gggggg ');
  }
}
