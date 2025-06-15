import { Module } from '@nestjs/common';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import { WeatherSchedulerService } from './weather-scheduler.service';

@Module({
  imports: [NotificationsModule, WeatherModule, SubscriptionModule],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerModule {}
