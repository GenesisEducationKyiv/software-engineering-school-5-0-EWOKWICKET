import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherSchedulerModule } from './weather-scheduler/weather-scheduler.module';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';

@Module({
  imports: [ScheduleModule.forRoot(), WeatherSchedulerModule, SubscriptionModule],
})
export class SchedulerModule {}
