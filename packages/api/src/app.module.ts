import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CityModule } from './application/city/city.module';
import { NotificationsModule } from './application/notifications/notifications.module';
import { SubscriptionModule } from './application/subscriptions/subscription.module';
import { WeatherModule } from './application/weather/weather.module';
import appConfig from './config/app.config';
import cacheConfig from './config/cache.config';
import databaseConfig from './config/database.config';
import { envSchema } from './config/env.validation';
import mailConfig from './config/mail.config';
import { CacheModule } from './infrastructure/cache/cache.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MetricsModule } from './infrastructure/metrics/metrics.module';
import { SchedulerModule } from './infrastructure/scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, mailConfig, cacheConfig],
      validationSchema: envSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'packages/api/public',
      serveRoot: '/weatherapi.app',
      exclude: ['/weatherapi.app/api*'],
    }),
    HttpModule.register({ global: true }),
    SchedulerModule,
    DatabaseModule,
    SubscriptionModule,
    NotificationsModule,
    WeatherModule,
    CityModule,
    CacheModule,
    MetricsModule,
  ],
})
export class AppModule {}
