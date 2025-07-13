import { Module } from '@nestjs/common';
import { SubscriptionServiceModule } from 'src/subscription/subscription-service.module';
import { WeatherServiceModule } from 'src/weather/weather-service.module';
import { SubscriptionController } from './subscription/subscription.controller';
import { WeatherController } from './weather/weather.controller';

@Module({
  imports: [WeatherServiceModule, SubscriptionServiceModule],
  controllers: [SubscriptionController, WeatherController],
})
export class GatewayModule {}
