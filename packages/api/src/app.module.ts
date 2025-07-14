import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appEnvSchema } from 'src/config/env.validation';
import { GatewayModule } from 'src/gateway/gateway.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import appConfig from './config/app.config';
import urlsConfig from './config/urls.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, urlsConfig],
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
