import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmationNotification, WeatherUpdateNotification } from 'src/application/constants/notification.type';
import { NotificationsFacadeInterface } from 'src/facade/interfaces/notifications-facade.interface';

@Controller()
export class NotificationsController {
  constructor(private readonly facade: NotificationsFacadeInterface) {}

  @Post('subscriptionConfirmation')
  async sendConfirmationNotification(@Body() { data, type }: { data: ConfirmationNotification; type: NotificationType }): Promise<void> {
    await this.facade.sendConfirmationNotification(data, type);
  }

  @Post('weatherUpdate')
  async sendWeatherUpdateNotification(@Body() { data, type }: { data: WeatherUpdateNotification; type: NotificationType }): Promise<void> {
    await this.facade.sendWeatherUpdateNotification(data, type);
  }
}
