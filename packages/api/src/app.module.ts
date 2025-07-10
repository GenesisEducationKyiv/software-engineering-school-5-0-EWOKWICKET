import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from 'src/cache/cache.module';
import { CityModule } from 'src/city/city.module';
import appConfig from 'src/config/app.config';
import cacheConfig from 'src/config/cache.config';
import databaseConfig from 'src/config/database.config';
import { envSchema } from 'src/config/env.validation';
import mailConfig from 'src/config/mail.config';
import { DatabaseModule } from 'src/database/database.module';
import { MetricsModule } from 'src/metrics/metrics.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';
import { WeatherSchedulerModule } from 'src/weather-scheduler/weather-scheduler.module';
import { WeatherModule } from 'src/weather/weather.module';

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
    WeatherSchedulerModule,
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
