import { Module } from '@nestjs/common';
import { MailModule } from 'src/notifications/mail/mail.module';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';
import { WeatherModule } from 'src/weather/weather.module';
import { WeatherSchedulerService } from './weather-scheduler.service';

@Module({
  imports: [MailModule, WeatherModule, SubscriptionModule],
  providers: [WeatherSchedulerService],
})
export class WeatherSchedulerModule {}
