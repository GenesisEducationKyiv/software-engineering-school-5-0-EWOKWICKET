import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { FindSubscriptionServiceToken } from 'src/scheduler/interfaces/subscription-service.interface';
import { WeatherModule } from 'src/weather/weather.module';
import { Subscription, SubscriptionSchema } from '../database/schemas/subscription.schema';
import { ControllerSubscriptionServiceToken } from './interfaces/subcription-service.interface';
import { SubscriptionRepositoryToken } from './interfaces/subscription-repository.interface';
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
    NotificationsModule,
    WeatherModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    {
      provide: SubscriptionRepositoryToken,
      useExisting: SubscriptionRepository,
    },
    {
      provide: FindSubscriptionServiceToken,
      useExisting: SubscriptionService,
    },
    {
      provide: ControllerSubscriptionServiceToken,
      useExisting: SubscriptionService,
    },
  ],
  exports: [FindSubscriptionServiceToken, ControllerSubscriptionServiceToken],
})
export class SubscriptionModule {}
