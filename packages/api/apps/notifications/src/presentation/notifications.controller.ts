import { Services } from '@common/configs/services';
import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsServiceInterface } from 'src/application/interfaces/notifications-service.abstract';
import { isRetriable } from 'src/common/utils/shouldRetry';

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
    } catch (err) {
      const retriable = isRetriable(err, message, this.logger, this.sendConfirmationNotification.name);

      if (!retriable) channel.ack(message);
      else channel.nack(message, false, false);
    }
  }

  @MessagePattern(Services.NOTIFICATIONS.events.update)
  async sendWeatherUpdateNotification(@Payload() { data, type }: { data: WeatherUpdateNotification; type: NotificationType }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.notificationsService.sendWeatherUpdateNotification(data, type);
      channel.ack(message);
    } catch (err) {
      const retriable = isRetriable(err, message, this.logger, this.sendWeatherUpdateNotification.name);

      if (!retriable) channel.ack(message);
      else channel.nack(message, false, false);
    }
  }
}
