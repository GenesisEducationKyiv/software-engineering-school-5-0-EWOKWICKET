import { Module } from '@nestjs/common';
import { SubscriptionTestModule } from 'src/subscription/test/subscription.module.test';
import { WeatherTestModule } from 'src/weather/test/weather.module.test';
import { SubscriptionController } from '../subscription/presentation/subscription.controller';
import { WeatherController } from '../weather/presentation/weather.controller';

@Module({
  imports: [WeatherTestModule, SubscriptionTestModule],
  controllers: [SubscriptionController, WeatherController],
})
export class GatewayTestModule {}
