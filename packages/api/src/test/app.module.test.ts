import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appTestConfig, databaseTestConfig } from 'src/config/test.config';
import { CityTestModule } from './city.module.test';
import { DatabaseTestModule } from './database.module.test';
import { NotificationsTestModule } from './notifications.module.test';
import { SubscriptionTestModule } from './subscriptions.module.test';
import { WeatherTestModule } from './weather.module.test';

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
