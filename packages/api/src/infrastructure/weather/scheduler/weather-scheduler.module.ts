import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { NotificationsModule } from 'src/infrastructure/notifications/notifications.module';
import { SubscriptionModule } from 'src/infrastructure/subscription/subscription.module';
import { WeatherUpdateInterface } from '../../../application/weather-scheduler/interfaces/weather-update.abstract';
import { WeatherSchedulerService } from '../../../application/weather-scheduler/weather-scheduler.service';
import { WeatherModule } from '../weather.module';
import { WeatherUpdateService } from './weather-update.service';

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
