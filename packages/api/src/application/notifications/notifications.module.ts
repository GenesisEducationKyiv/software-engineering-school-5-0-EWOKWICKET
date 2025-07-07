import { Module } from '@nestjs/common';
import { NotificationsServiceInterface } from 'src/application/notifications/interfaces/notifications-service.abstract';
import { MailModule } from '../../infrastructure/mail/mail.module';
import { MailSender } from '../../infrastructure/mail/services/mail-sender.service';
import { NotificationsSender, NotificationsSenderToken } from './interfaces/notifications-sender.interface';
import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [MailModule],
  providers: [
    {
      provide: NotificationsServiceInterface,
      useClass: NotificationsService,
    },
    {
      provide: NotificationsSenderToken,
      useFactory: (mailSender: MailSender): NotificationsSender[] => {
        return [mailSender];
      },
      inject: [MailSender],
    },
  ],
  exports: [NotificationsServiceInterface],
})
export class NotificationsModule {}
