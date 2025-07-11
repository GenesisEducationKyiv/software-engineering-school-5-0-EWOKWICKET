import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsSender, NotificationsSenderToken } from './application/interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from './application/interfaces/notifications-service.abstract';
import { NotificationsService } from './application/notifications.service';
import { notificationsEnvSchema } from './config/env.validation';
import mailConfig from './config/mail.config';
import { MailModule } from './infrastructure/mail/mail.module';
import { MailSender } from './infrastructure/mail/services/mail-sender.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/notifications/.env',
      validationSchema: notificationsEnvSchema,
      load: [mailConfig],
    }),
    MailModule,
  ],
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
export class NotificationsServiceModule {}
