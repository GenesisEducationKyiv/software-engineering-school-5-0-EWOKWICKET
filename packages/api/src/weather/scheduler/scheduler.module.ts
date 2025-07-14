import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CacheModule } from '../cache/cache.module';
import { WeatherAPIModule } from '../weather-api/weather-api.module';
import { WeatherModule } from '../weather.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { SchedulerService } from './application/scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsModule, CacheModule, WeatherAPIModule, forwardRef(() => WeatherModule)],
  providers: [
    SchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class SchedulerModule {}
