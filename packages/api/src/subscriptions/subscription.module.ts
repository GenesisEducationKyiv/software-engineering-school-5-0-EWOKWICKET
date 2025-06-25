import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Subscription, SubscriptionSchema } from '../database/schemas/subscription.schema';
import { ControllerSubscriptionService, FindSubscriptionService } from './abstractions/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from './abstractions/subscription-repository.abstract';
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
    CityModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: FindSubscriptionService,
      useExisting: SubscriptionService,
    },
    {
      provide: ControllerSubscriptionService,
      useExisting: SubscriptionService,
    },
    SubscriptionRepository,
    {
      provide: ServiceSubscriptionRepository,
      useExisting: SubscriptionRepository,
    },
    {
      provide: GroupSubscriptionRepository,
      useExisting: SubscriptionRepository,
    },
  ],
  exports: [FindSubscriptionService, ControllerSubscriptionService, ServiceSubscriptionRepository, GroupSubscriptionRepository],
})
export class SubscriptionModule {}
