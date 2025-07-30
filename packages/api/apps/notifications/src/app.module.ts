import { CacheAccessor } from '@cache/application/interfaces/cache-service.interface';
import { CacheModule } from '@cache/cache.module';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsSender, NotificationsSenderToken } from './application/interfaces/notifications-sender.interface';
import { NotificationsServiceInterface } from './application/interfaces/notifications-service.abstract';
import { NotificationsService } from './application/notifications.service';
import appConfig from './config/app.config';
import cacheConfig from './config/cache.config';
import { notificationsEnvSchema } from './config/env.validation';
import loggerConfig from './config/logger.config';
import mailConfig from './config/mail.config';
import urlsConfig from './config/urls.config';
import { MailModule } from './infrastructure/mail.module';
import { MailSender } from './infrastructure/services/mail-sender.service';
import { NotificaionsCacheProxy } from './infrastructure/wrappers/cache.proxy';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsController } from './presentation/notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: notificationsEnvSchema,
      load: [appConfig, mailConfig, urlsConfig, loggerConfig, cacheConfig],
    }),
    LoggerModule.forRoot({
      service: 'Notifications',
      samplingRate: 0.7,
    }),
    MetricsModule,
    MailModule,
    CacheModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: NotificationsServiceInterface,
      inject: [NotificationsService, CacheAccessor, LoggerInterface],
      useFactory: (notificationsService: NotificationsService, cacheService: CacheAccessor, logger: LoggerInterface) => {
        return new NotificaionsCacheProxy(notificationsService, cacheService, logger);
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
