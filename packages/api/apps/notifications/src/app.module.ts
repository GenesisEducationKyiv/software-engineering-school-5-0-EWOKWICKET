import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsSender, NotificationsSenderToken } from './application/interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from './application/interfaces/notifications-service.abstract';
import { NotificationsService } from './application/notifications.service';
import appConfig from './config/app.config';
import { notificationsEnvSchema } from './config/env.validation';
import mailConfig from './config/mail.config';
import { MailModule } from './infrastructure/mail.module';
import { MailSender } from './infrastructure/services/mail-sender.service';
import { NotificationsController } from './presentation/notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: notificationsEnvSchema,
      load: [appConfig, mailConfig],
    }),
    MailModule,
  ],
  controllers: [NotificationsController],
  providers: [
    { provide: NotificationsServiceInterface, useClass: NotificationsService },
    {
      provide: NotificationsSenderToken,
      useFactory: (mailSender: MailSender): NotificationsSender[] => {
        return [mailSender];
      },
      inject: [MailSender],
    },
  ],
})
export class AppModule {}
