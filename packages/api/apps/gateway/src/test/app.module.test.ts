import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherClient } from '../common/clients/interfaces/weather-client.interface';
import { appTestConfig } from '../config/test.config';
import urlsConfig from '../config/urls.config';
import { SubscriptionClient } from '../subscription/application/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from '../subscription/infrastructure/subscription.http-client';
import { SubscriptionController } from '../subscription/presentation/subscription.controller';
import { WeatherHttpClient } from '../weather/infrastructure/weather.http-client';
import { WeatherController } from '../weather/presentation/weather.controller';

@Module({
  imports: [
    HttpModule.register({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [appTestConfig, urlsConfig],
    }),
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
export class AppTestModule {}
