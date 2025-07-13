import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appTestConfig } from 'src/config/test.config';
import { GatewayTestModule } from 'src/gateway/test/gateway.module.test';
import { NotificationsTestModule } from 'src/notifications/test/notifications.module.test';
import { databaseTestConfig } from 'src/subscription/config/test.config';
import { SubscriptionTestModule } from 'src/subscription/test/subscription.module.test';
import { WeatherTestModule } from 'src/weather/test/weather.module.test';

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
    WeatherTestModule,
    NotificationsTestModule,
    SubscriptionTestModule,
    GatewayTestModule,
  ],
})
export class AppTestModule {}
