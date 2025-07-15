import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppModule } from 'src/app.module';
import { CacheModule } from 'src/cache/cache.module';
import { WeatherAPIModule } from 'src/weather-api/weather-api.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { SchedulerService } from './application/scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), CacheModule, WeatherAPIModule, forwardRef(() => AppModule)],
  providers: [
    SchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class SchedulerModule {}
