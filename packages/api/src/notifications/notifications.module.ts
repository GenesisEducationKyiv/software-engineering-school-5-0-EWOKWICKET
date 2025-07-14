import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsFacadeInterface } from 'src/notifications/facade/interfaces/notifications-facade.interface';
import { NotificationsSender, NotificationsSenderToken } from './application/interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from './application/interfaces/notifications-service.abstract';
import { NotificationsService } from './application/notifications.service';
import { notificationsEnvSchema } from './config/env.validation';
import mailConfig from './config/mail.config';
import { NotificationsFacade } from './facade/notifications.facade';
import { MailModule } from './infrastructure/mail/mail.module';
import { MailSender } from './infrastructure/mail/services/mail-sender.service';
import { NotificationsController } from './presentation/notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: notificationsEnvSchema,
      load: [mailConfig],
    }),
    MailModule,
  ],
  controllers: [NotificationsController],
  providers: [
    { provide: NotificationsServiceInterface, useClass: NotificationsService },
    { provide: NotificationsFacadeInterface, useClass: NotificationsFacade },
    {
      provide: NotificationsSenderToken,
      useFactory: (mailSender: MailSender): NotificationsSender[] => {
        return [mailSender];
      },
      inject: [MailSender],
    },
  ],
})
export class NotificationsModule {}
