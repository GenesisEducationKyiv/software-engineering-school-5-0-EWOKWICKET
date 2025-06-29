import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from './cache/cache.module';
import { CityModule } from './city/city.module';
import appConfig from './config/app.config';
import cacheConfig from './config/cache.config';
import databaseConfig from './config/database.config';
import { envSchema } from './config/env.validation';
import mailConfig from './config/mail.config';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { WeatherModule } from './weather/weather.module';

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
    SchedulerModule,
    DatabaseModule,
    SubscriptionModule,
    NotificationsModule,
    WeatherModule,
    CityModule,
    CacheModule,
  ],
})
export class AppModule {}
