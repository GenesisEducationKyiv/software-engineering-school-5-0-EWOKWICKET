import { Module } from '@nestjs/common';
import { NotificationsSender, NotificationsSenderToken } from '../interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from '../interfaces/notifications-service.interface';
import { MailModule } from '../mail/mail.module';
import { MailSender } from '../mail/services/mail-sender.service';

const notificationsServiceMock: NotificationsServiceInterface = {
  sendConfirmationNotification: async () => {},
  sendWeatherUpdateNotification: async () => {},
};

@Module({
  imports: [MailModule],
  providers: [
    {
      provide: NotificationsServiceInterface,
      useValue: notificationsServiceMock,
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
export class NotificationsTestModule {}
