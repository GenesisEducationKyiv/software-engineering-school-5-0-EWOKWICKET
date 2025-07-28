import { Services } from '@common/configs/services';
import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsServiceInterface } from 'src/application/interfaces/notifications-service.abstract';

@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsServiceInterface,
    private readonly logger: LoggerInterface,
  ) {}

  @MessagePattern(Services.NOTIFICATIONS.events.confirmation)
  async sendConfirmationNotification(@Payload() { data, type }: { data: ConfirmationNotification; type: NotificationType }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.notificationsService.sendConfirmationNotification(data, type);
      channel.ack(message);
      this.logger.info('Confirmation notification sent', {
        data: { userId: data.token, reciever: data.to },
      });
    } catch (err) {
      console.error('Error processing message:', err);
      channel.nack(message, false, true);
    }
  }

  @MessagePattern(Services.NOTIFICATIONS.events.update)
  async sendWeatherUpdateNotification(@Payload() { data, type }: { data: WeatherUpdateNotification; type: NotificationType }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.notificationsService.sendWeatherUpdateNotification(data, type);
      channel.ack(message);
      this.logger.info('Weather update notification sent', {
        data: { city: data.data.city, reciever: data.to },
      });
    } catch (err) {
      console.error('Error processing message:', err);
      channel.nack(message, false, true);
    }
  }
}
