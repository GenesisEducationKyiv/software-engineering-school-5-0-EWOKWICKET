import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import { WeatherSchedulerService } from './weather-scheduler.service';

@Module({
  imports: [NotificationsModule, WeatherModule, SubscriptionModule, CacheModule],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerModule {}
