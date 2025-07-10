import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from 'src/cache/cache.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { WeatherSchedulerService } from './application/weather-scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsModule, WeatherModule, SubscriptionModule, CacheModule],
  providers: [
    WeatherSchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class WeatherSchedulerModule {}
