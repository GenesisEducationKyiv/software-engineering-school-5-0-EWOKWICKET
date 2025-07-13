import { Module } from '@nestjs/common';
import { SubscriptionModule } from 'src/subscription/subscription-service.module';
import { WeatherModule } from 'src/weather/weather.module';
import { SubscriptionController } from './subscription/subscription.controller';
import { WeatherController } from './weather/weather.controller';

@Module({
  imports: [WeatherModule, SubscriptionModule],
  controllers: [SubscriptionController, WeatherController],
})
export class GatewayModule {}
