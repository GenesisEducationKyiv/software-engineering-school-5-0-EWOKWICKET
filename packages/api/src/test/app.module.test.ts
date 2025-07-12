import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appTestConfig } from 'src/config/test.config';
import { NotificationsServiceTestModule } from 'src/notifications/test/notifications-service.module.test';
import { databaseTestConfig } from 'src/subscription/config/test.config';
import { SubscriptionServiceTestModule } from 'src/subscription/test/subscription-service.module.test';
import { WeatherServiceTestModule } from 'src/weather/test/weather-service.module.test';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appTestConfig, databaseTestConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: '/app/public',
      serveRoot: '/weatherapi.app',
      exclude: ['/weatherapi.app/api/(.*)'],
    }),
    WeatherServiceTestModule,
    NotificationsServiceTestModule,
    SubscriptionServiceTestModule,
  ],
})
export class AppTestModule {}
