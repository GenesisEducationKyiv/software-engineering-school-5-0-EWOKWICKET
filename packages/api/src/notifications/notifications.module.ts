import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsServiceInterface } from 'src/notifications/abstractions/notifications-service.abstract';
import { NotificationsSender, NotificationsSenderToken } from './abstractions/notifications-sender.interface';
import { MailModule } from './mail/mail.module';
import { MailSender } from './mail/services/mail-sender.service';
import { NotificationsService } from './notifications.service';

const notificationsServiceMock: NotificationsServiceInterface = {
  sendConfirmationNotification: async () => {},
  sendWeatherUpdateNotification: async () => {},
};

@Module({
  imports: [MailModule],
  providers: [
    NotificationsService,
    {
      provide: NotificationsServiceInterface,
      useFactory: (configService: ConfigService, notificationsService: NotificationsService): NotificationsServiceInterface => {
        if (configService.get('NODE_ENV') === 'e2e') return notificationsServiceMock;
        return notificationsService;
      },
      inject: [ConfigService, NotificationsService],
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
