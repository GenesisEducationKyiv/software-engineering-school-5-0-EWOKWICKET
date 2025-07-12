import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsServiceModule } from 'src/notifications/notifications-service.module';
import { SubscriptionServiceModule } from 'src/subscription/subscription-service.module';
import { CacheModule } from '../cache/cache.module';
import { WeatherModule } from '../weather/weather.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { WeatherSchedulerService } from './application/weather-scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsServiceModule, forwardRef(() => SubscriptionServiceModule), CacheModule, WeatherModule],
  providers: [
    WeatherSchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class WeatherSchedulerModule {}
