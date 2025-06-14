import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherSchedulerModule } from './weather/weather-scheduler.module';

@Module({
  imports: [ScheduleModule.forRoot(), WeatherSchedulerModule],
})
export class SchedulerModule {}
