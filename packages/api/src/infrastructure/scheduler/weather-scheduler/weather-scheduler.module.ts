import { Module } from '@nestjs/common';
import { NotificationsModule } from 'src/application/notifications/notifications.module';
import { SubscriptionModule } from 'src/application/subscriptions/subscription.module';
import { WeatherModule } from 'src/application/weather/weather.module';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { WeatherSchedulerService } from './weather-scheduler.service';

@Module({
  imports: [NotificationsModule, WeatherModule, SubscriptionModule, CacheModule],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerModule {}
