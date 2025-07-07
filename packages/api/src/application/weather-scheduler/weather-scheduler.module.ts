import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from 'src/application/notifications/notifications.module';
import { SubscriptionModule } from 'src/application/subscriptions/subscription.module';
import { WeatherModule } from 'src/application/weather/weather.module';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { WeatherUpdateService } from 'src/infrastructure/weather/weather-update.service';
import { WeatherUpdateInterface } from './interfaces/weather-update.abstract';
import { WeatherSchedulerService } from './weather-scheduler.service';

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
