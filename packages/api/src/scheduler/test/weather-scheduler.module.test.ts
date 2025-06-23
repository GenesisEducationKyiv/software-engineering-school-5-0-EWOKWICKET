import { Module } from '@nestjs/common';
import { NotificationsTestModule } from 'src/notifications/test/notifications.module.test';
import { SubscriptionTestModule } from 'src/subscriptions/test/subscriptions.module.test';
import { WeatherModule } from 'src/weather/weather.module';
import { WeatherSchedulerService } from '../weather-scheduler/weather-scheduler.service';

@Module({
  imports: [NotificationsTestModule, WeatherModule, SubscriptionTestModule],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerTestModule {}
