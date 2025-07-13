import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import appConfig from 'src/config/app.config';
import { appEnvSchema } from 'src/config/env.validation';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationsServiceModule } from './notifications/notifications-service.module';
import { SubscriptionServiceModule } from './subscription/subscription-service.module';
import { WeatherServiceModule } from './weather/weather-service.module';

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
    WeatherServiceModule,
    SubscriptionServiceModule,
    NotificationsServiceModule,
    GatewayModule,
  ],
})
export class AppModule {}
