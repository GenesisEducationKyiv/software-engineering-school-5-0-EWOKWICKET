import { Module } from '@nestjs/common';
import { NotificationsServiceInterface } from 'src/notifications/abstractions/notifications-service.abstract';
import { NotificationsSender, NotificationsSenderToken } from './abstractions/notifications-sender.interface';
import { MailModule } from './mail/mail.module';
import { MailSender } from './mail/services/mail-sender.service';
import { NotificationsService } from './notifications.service';

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
