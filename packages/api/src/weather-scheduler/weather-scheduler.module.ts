import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from 'src/cache/cache.module';
import { NotificationsServiceModule } from 'src/notifications/notifications-service.module';
import { SubscripionServiceModule } from 'src/subscription/subscription-service.module';
import { WeatherServiceModule } from 'src/weather/weather-service.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { WeatherSchedulerService } from './application/weather-scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsServiceModule, WeatherServiceModule, SubscripionServiceModule, CacheModule],
  providers: [
    WeatherSchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class WeatherSchedulerModule {}
