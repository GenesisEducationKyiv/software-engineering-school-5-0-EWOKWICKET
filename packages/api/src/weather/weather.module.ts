import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { Subscription, SubscriptionSchema } from 'src/subscriptions/schemas/subscription.schema';
import { WeatherApiService } from './services/weather-api.service';
import { WeatherSchedulerService } from './services/weather-scheduler.service';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    MailModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherApiService, WeatherSchedulerService],
  exports: [WeatherService],
})
export class WeatherModule {}
