import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ConfirmationNotificationOptions, WeatherUpdateNotificationOptions } from '@proto/notifications';
import { NotificationTypeValidationPipe } from 'src/common/pipes/notification-type-validation.pipe';
import { NotificationsFacadeInterface } from 'src/facade/interfaces/notifications-facade.interface';

@Controller()
export class NotificationsController {
  constructor(private readonly facade: NotificationsFacadeInterface) {}

  @GrpcMethod('NotificationsService', 'sendConfirmationNotification')
  async sendConfirmationNotification({ data, type }: ConfirmationNotificationOptions): Promise<void> {
    const validatedType = new NotificationTypeValidationPipe().transform(type);
    await this.facade.sendConfirmationNotification(data, validatedType);
  }

  @GrpcMethod('NotificationsService', 'sendWeatherUpdateNotification')
  async sendWeatherUpdateNotification({ data, type }: WeatherUpdateNotificationOptions): Promise<void> {
    const validatedType = new NotificationTypeValidationPipe().transform(type);
    await this.facade.sendWeatherUpdateNotification(data, validatedType);
  }
}
