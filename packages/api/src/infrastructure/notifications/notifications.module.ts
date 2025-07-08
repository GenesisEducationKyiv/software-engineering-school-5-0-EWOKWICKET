import { Module } from '@nestjs/common';
import { NotificationsSender, NotificationsSenderToken } from 'src/application/notifications/interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from 'src/application/notifications/interfaces/notifications-service.abstract';
import { NotificationsService } from 'src/application/notifications/notifications.service';
import { MailModule } from './mail/mail.module';
import { MailSender } from './mail/services/mail-sender.service';

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
