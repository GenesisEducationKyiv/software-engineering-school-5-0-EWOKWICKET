import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { ConfirmationNotification, UpdateWeatherNotification } from 'src/common/constants/types/notification.interface';
import { INotificationsService } from './interfaces/notifications-service.interface';
import { MailSenderService } from './mail/mail-sender.service';

@Injectable()
export class NotificationsService {
  private strategies: Record<NotificationType, INotificationsService>;

  constructor(private readonly mailSender: MailSenderService) {
    this.strategies = {
      email: mailSender,
    };
  }

  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType) {
    const strategy = this.strategies[type];
    if (!strategy) throw new InternalServerErrorException();
    await strategy.sendConfirmationNotification(data);
  }

  async sendWeatherUpdateNotification(data: UpdateWeatherNotification, type: NotificationType) {
    const strategy = this.strategies[type];
    if (!strategy) throw new InternalServerErrorException();
    await strategy.sendWeatherUpdateNotification(data);
  }
}
