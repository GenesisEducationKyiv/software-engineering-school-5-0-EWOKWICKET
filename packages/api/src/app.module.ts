import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import appConfig from 'src/config/app.config';
import { appEnvSchema } from 'src/config/env.validation';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscriptionModule } from './subscription/subscription-service.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      validationSchema: appEnvSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'packages/public',
      serveRoot: '/weatherapi.app',
      exclude: ['/weatherapi.app/api*'],
    }),
    HttpModule.register({ global: true }),
    WeatherModule,
    SubscriptionModule,
    NotificationsModule,
    GatewayModule,
  ],
})
export class AppModule {}
