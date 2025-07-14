import { Module } from '@nestjs/common';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import { SubscriptionClient } from './subscription/application/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from './subscription/infrastructure/subscription.http-client';
import { SubscriptionController } from './subscription/presentation/subscription.controller';
import { WeatherController } from './weather/weather.controller';

@Module({
  imports: [WeatherModule, SubscriptionModule],
  controllers: [SubscriptionController, WeatherController],
  providers: [
    {
      provide: SubscriptionClient,
      useClass: SubscriptionHttpClient,
    },
  ],
})
export class GatewayModule {}
