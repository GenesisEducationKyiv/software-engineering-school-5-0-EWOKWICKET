import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SubscriptionModule } from 'src/subscription/subscription-service.module';
import { CacheModule } from '../cache/cache.module';
import { WeatherAPIModule } from '../weather-api/weather-api.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { WeatherSchedulerService } from './application/weather-scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsModule, forwardRef(() => SubscriptionModule), CacheModule, WeatherAPIModule],
  providers: [
    WeatherSchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class WeatherSchedulerModule {}
