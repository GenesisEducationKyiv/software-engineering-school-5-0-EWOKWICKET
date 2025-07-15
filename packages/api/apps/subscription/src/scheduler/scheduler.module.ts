import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppModule } from 'src/app.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { SchedulerService } from './application/scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';
import { SubscriptionDomainModule } from 'src/subscription-domain/subscription-domain.module';

@Module({
  imports: [ScheduleModule.forRoot(), forwardRef(() => AppModule), SubscriptionDomainModule],
  providers: [
    SchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
  ],
})
export class SchedulerModule {}
