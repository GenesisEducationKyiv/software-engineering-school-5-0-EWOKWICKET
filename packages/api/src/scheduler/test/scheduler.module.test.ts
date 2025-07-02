import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionTestModule } from 'src/subscriptions/test/subscriptions.module.test';
import { WeatherSchedulerTestModule } from './weather-scheduler.module.test';

@Module({
  imports: [ScheduleModule.forRoot(), WeatherSchedulerTestModule, SubscriptionTestModule],
})
export class SchedulerTestModule {}
