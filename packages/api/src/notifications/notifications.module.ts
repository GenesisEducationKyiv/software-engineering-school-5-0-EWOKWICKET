import { Module } from '@nestjs/common';
import { NotificationsServiceToken } from 'src/scheduler/interfaces/notifications-service.interface';
import { INotificationsSender, NotificationsSenderToken } from './interfaces/notifications-sender.interface';
import { MailSenderService } from './mail/mail-sender.service';
import { MailModule } from './mail/mail.module';
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
      useFactory: (mailSender: MailSenderService): INotificationsSender[] => {
        return [mailSender];
      },
      inject: [MailSenderService],
    },
  ],
  exports: [NotificationsServiceToken, NotificationsSenderToken],
})
export class NotificationsModule {}
