import { Module } from '@nestjs/common';
import { SubscriptionTestModule } from 'src/subscription/src/test/subscription.module.test';
import { WeatherTestModule } from 'src/weather/src/test/weather.module.test';
import { SubscriptionController } from '../subscription/presentation/subscription.controller';
import { WeatherController } from '../weather/presentation/weather.controller';

@Module({
  imports: [WeatherTestModule, SubscriptionTestModule],
  controllers: [SubscriptionController, WeatherController],
})
export class GatewayTestModule {}
