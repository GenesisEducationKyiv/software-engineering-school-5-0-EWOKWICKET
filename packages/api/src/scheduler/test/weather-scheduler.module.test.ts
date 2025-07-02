import { Module } from '@nestjs/common';
import { NotificationsTestModule } from 'src/notifications/test/notifications.module.test';
import { SubscriptionTestModule } from 'src/subscriptions/test/subscriptions.module.test';
import { WeatherTestModule } from 'src/weather/test/weather.module.test';
import { WeatherSchedulerService } from '../weather-scheduler/weather-scheduler.service';

@Module({
  imports: [NotificationsTestModule, WeatherTestModule, SubscriptionTestModule],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerTestModule {}
