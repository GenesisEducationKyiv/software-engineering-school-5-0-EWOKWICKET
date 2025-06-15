import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherSchedulerModule } from './weather-scheduler/weather-scheduler.module';

@Module({
  imports: [ScheduleModule.forRoot(), WeatherSchedulerModule],
})
export class SchedulerModule {}
