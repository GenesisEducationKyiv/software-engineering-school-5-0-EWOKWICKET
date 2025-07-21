import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ConfirmationNotificationOptions, WeatherUpdateNotificationOptions } from '@proto/notifications';
import { NotificationsServiceInterface } from 'src/application/interfaces/notifications-service.abstract';
import { NotificationTypeValidationPipe } from 'src/common/pipes/notification-type-validation.pipe';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsServiceInterface) {}

  @GrpcMethod('NotificationsService', 'sendConfirmationNotification')
  async sendConfirmationNotification({ data, type }: ConfirmationNotificationOptions): Promise<void> {
    const validatedType = new NotificationTypeValidationPipe().transform(type);
    await this.notificationsService.sendConfirmationNotification(data, validatedType);
  }

  @GrpcMethod('NotificationsService', 'sendWeatherUpdateNotification')
  async sendWeatherUpdateNotification({ data, type }: WeatherUpdateNotificationOptions): Promise<void> {
    const validatedType = new NotificationTypeValidationPipe().transform(type);
    await this.notificationsService.sendWeatherUpdateNotification(data, validatedType);
  }
}
