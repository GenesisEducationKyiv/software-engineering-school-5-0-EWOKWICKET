import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification } from '@common/contracts/notifications/constants/notifications.type';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsFacadeInterface } from 'src/facade/interfaces/notifications-facade.interface';

@Controller()
export class NotificationsController {
  constructor(private readonly facade: NotificationsFacadeInterface) {}

  @MessagePattern('send_notification')
  async handleSendNotification({ data, type }: { data: ConfirmationNotification; type: NotificationType }) {
    try {
      await this.facade.sendConfirmationNotification(data, type);
    } catch {
      console.log('ERR OCCURED');
    }
  }

  // @GrpcMethod('NotificationsService', 'sendConfirmationNotification')
  // async sendConfirmationNotification({ data, type }: ConfirmationNotificationOptions): Promise<void> {
  //   const validatedType = new NotificationTypeValidationPipe().transform(type);
  //   await this.facade.sendConfirmationNotification(data, validatedType);
  // }

  // @GrpcMethod('NotificationsService', 'sendWeatherUpdateNotification')
  // async sendWeatherUpdateNotification({ data, type }: WeatherUpdateNotificationOptions): Promise<void> {
  //   const validatedType = new NotificationTypeValidationPipe().transform(type);
  //   await this.facade.sendWeatherUpdateNotification(data, validatedType);
  // }
}
