import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/notifications/mail/mail.module';
import { WeatherModule } from 'src/weather/weather.module';
import { Subscription, SubscriptionSchema } from '../database/schemas/subscription.schema';
import { SubscriptionRepository } from './services/subscription.repository';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    MailModule,
    WeatherModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    {
      provide: 'IWeatherSubscriptionRepository',
      useExisting: SubscriptionRepository,
    },
    {
      provide: 'IServiceSubscriptionRepository',
      useExisting: SubscriptionRepository,
    },
  ],
  exports: ['IWeatherSubscriptionRepository', 'IServiceSubscriptionRepository'],
})
export class SubscriptionModule {}
