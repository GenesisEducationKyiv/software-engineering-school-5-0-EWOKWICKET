import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CityTestModule } from 'src/application/city/city.module.test';
import { SubscriptionTestModule } from 'src/application/subscriptions/subscriptions.module.test';
import { NotificationsTestModule } from './application/notifications/notifications.module.test';
import { WeatherTestModule } from './application/weather/weather.module.test';
import { appTestConfig, databaseTestConfig } from './config/test.config';
import { DatabaseTestModule } from './infrastructure/database/test/database.module.test';

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
    DatabaseTestModule,
    SubscriptionTestModule,
    NotificationsTestModule,
    WeatherTestModule,
    CityTestModule,
  ],
})
export class AppTestModule {}
