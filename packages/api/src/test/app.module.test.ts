import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appTestConfig } from 'src/config/test.config';
import { NotificationsServiceTestModule } from 'src/notifications/notifications-service.module.test';
import { databaseTestConfig } from 'src/subscription/config/test.config';
import { SubscriptionDatabaseTestModule } from 'src/subscription/database/database.module.test';
import { SubscriptionTestModule } from 'src/subscription/subscriptions/subscriptions.module.test';
import { CityTestModule } from 'src/weather/city/city.module.test';
import { WeatherTestModule } from 'src/weather/weather/weather.module.test';

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
    SubscriptionDatabaseTestModule,
    SubscriptionTestModule,
    NotificationsServiceTestModule,
    WeatherTestModule,
    CityTestModule,
  ],
})
export class AppTestModule {}
