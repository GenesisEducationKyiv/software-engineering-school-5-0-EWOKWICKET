import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import appConfig from './config/app.config';
import { appEnvSchema } from './config/env.validation';
import urlsConfig from './config/urls.config';
import { SubscriptionClient } from './subscription/application/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from './subscription/infrastructure/subscription.http-client';
import { SubscriptionController } from './subscription/presentation/subscription.controller';
import { WeatherClient } from './weather/application/interfaces/weather-client.interface';
import { WeatherHttpClient } from './weather/infrastructure/weather.http-client';
import { WeatherController } from './weather/presentation/weather.controller';

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
  ],
  controllers: [SubscriptionController, WeatherController],
  providers: [
    {
      provide: SubscriptionClient,
      useClass: SubscriptionHttpClient,
    },
    {
      provide: WeatherClient,
      useClass: WeatherHttpClient,
    },
  ],
})
export class AppModule {}
