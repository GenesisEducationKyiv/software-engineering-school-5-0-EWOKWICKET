import { Module } from '@nestjs/common';
import { SubscriptionClient } from './subscription/application/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from './subscription/infrastructure/subscription.http-client';
import { SubscriptionController } from './subscription/presentation/subscription.controller';
import { WeatherClient } from './weather/application/interfaces/weather-client.interface';
import { WeatherHttpClient } from './weather/infrastructure/weather.http-client';
import { WeatherController } from './weather/presentation/weather.controller';

@Module({
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
export class GatewayModule {}
