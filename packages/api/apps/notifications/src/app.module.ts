import { CacheAccessor } from '@cache/application/interfaces/cache-service.interface';
import { CacheModule } from '@cache/cache.module';
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
import { NotificaionsCacheProxy } from './infrastructure/wrappers/cache.proxy';
import { NotificationsController } from './presentation/notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: notificationsEnvSchema,
      load: [appConfig, mailConfig],
    }),
    MailModule,
    CacheModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: NotificationsServiceInterface,
      inject: [NotificationsService, CacheAccessor],
      useFactory: (notificationsService: NotificationsService, cacheService: CacheAccessor) => {
        return new NotificaionsCacheProxy(notificationsService, cacheService);
      },
    },
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
