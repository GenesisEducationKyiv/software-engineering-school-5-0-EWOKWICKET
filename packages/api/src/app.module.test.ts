import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CityTestModule } from 'src/city/test/city.module.test';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationsTestModule } from 'src/notifications/test/notifications.module.test';
import { SchedulerTestModule } from 'src/scheduler/test/scheduler.module.test';
import { SubscriptionTestModule } from 'src/subscriptions/test/subscriptions.module.test';
import { appTestConfig, databaseTestConfig } from './config/test.config';
import { WeatherTestModule } from './weather/test/weather.module.test';

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
    SchedulerTestModule,
    DatabaseModule,
    SubscriptionTestModule,
    NotificationsTestModule,
    WeatherTestModule,
    CityTestModule,
  ],
})
export class AppTestModule {}
