import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotificationType } from '../../common/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from './constants/notification.type';
import { NotificationsSender, NotificationsSenderToken } from './interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from './interfaces/notifications-service.abstract';

@Injectable()
export class NotificationsService implements NotificationsServiceInterface {
  private strategies: Record<NotificationType, NotificationsSender>;

  constructor(
    @Inject(NotificationsSenderToken)
    private readonly senders: NotificationsSender[],
  ) {
    this.strategies = Object.fromEntries(this.senders.map((s) => [s.type, s])) as Record<NotificationType, NotificationsSender>;
  }

  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType) {
    const strategy = this._getStrategy(type);
    await strategy.sendConfirmationNotification(data);
  }

  async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType) {
    const strategy = this._getStrategy(type);
    await strategy.sendWeatherUpdateNotification(data);
  }

  private _getStrategy(type: NotificationType): NotificationsSender {
    const strategy = this.strategies[type];
    if (!strategy) throw new InternalServerErrorException('Unexpected Notification Error Occured');
    return strategy;
  }
}
