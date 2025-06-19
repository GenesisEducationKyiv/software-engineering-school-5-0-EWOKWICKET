import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from 'src/notifications/constants/notification.interface';
import { INotificationsService } from 'src/scheduler/interfaces/notifications-service.interface';
import { INotificationsSender, NotificationsSenderToken } from './interfaces/notifications-sender.interface';

@Injectable()
export class NotificationsService implements INotificationsService {
  private strategies: Record<NotificationType, INotificationsSender>;

  constructor(
    @Inject(NotificationsSenderToken)
    private readonly senders: INotificationsSender[],
  ) {
    this.strategies = Object.fromEntries(this.senders.map((s) => [s.type, s])) as Record<NotificationType, INotificationsSender>;
  }

  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType) {
    const strategy = this._getStrategy(type);
    await strategy.sendConfirmationNotification(data);
  }

  async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType) {
    const strategy = this._getStrategy(type);
    await strategy.sendWeatherUpdateNotification(data);
  }

  private _getStrategy(type: NotificationType): INotificationsSender {
    const strategy = this.strategies[type];
    if (!strategy) throw new InternalServerErrorException('Unexpected Notification Error Occured');
    return strategy;
  }
}
