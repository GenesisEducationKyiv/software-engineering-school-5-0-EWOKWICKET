import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsServiceModule } from 'src/notifications/notifications-service.module';
import { CacheModule } from 'src/weather/cache/cache.module';
import { WeatherModule } from '../weather/weather.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { WeatherSchedulerService } from './application/weather-scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';
import { SubscriptionModule } from 'src/subscription/subscriptions/subscription.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsServiceModule, WeatherModule, SubscriptionModule, CacheModule],
  providers: [
    WeatherSchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class WeatherSchedulerModule {}
