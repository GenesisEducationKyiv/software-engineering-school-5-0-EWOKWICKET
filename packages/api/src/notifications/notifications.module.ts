import { Module } from '@nestjs/common';
import { NotificationsServiceToken } from 'src/scheduler/interfaces/notifications-service.interface';
import { NotificationsSender, NotificationsSenderToken } from './interfaces/notifications-sender.interface';
import { MailModule } from './mail/mail.module';
import { MailSender } from './mail/services/mail-sender.service';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [MailModule],
  providers: [
    NotificationsService,
    {
      provide: NotificationsServiceToken,
      useExisting: NotificationsService,
    },
    {
      provide: NotificationsSenderToken,
      useFactory: (mailSender: MailSender): NotificationsSender[] => {
        return [mailSender];
      },
      inject: [MailSender],
    },
  ],
  exports: [NotificationsServiceToken],
})
export class NotificationsModule {}
