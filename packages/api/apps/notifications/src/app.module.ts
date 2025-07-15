import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsSender, NotificationsSenderToken } from './application/interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from './application/interfaces/notifications-service.abstract';
import { NotificationsService } from './application/notifications.service';
import appConfig from './config/app.config';
import { notificationsEnvSchema } from './config/env.validation';
import mailConfig from './config/mail.config';
import { NotificationsFacadeInterface } from './facade/interfaces/notifications-facade.interface';
import { NotificationsFacade } from './facade/notifications.facade';
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
    HttpModule.register({ global: true }),
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
export class AppModule {}
