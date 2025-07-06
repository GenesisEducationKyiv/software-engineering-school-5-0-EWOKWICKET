import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityTestModule } from 'src/application/city/city.module.test';
import { SubscriptionRepository } from 'src/infrastructure/subscription/repositories/subscription.repository';
import { Subscription, SubscriptionSchema } from 'src/infrastructure/subscription/schemas/subscription.schema';
import { SubscriptionController } from 'src/presentation/subscription.controller';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from '../../domain/subscription/services/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from '../../domain/subscription/services/subscription-repository.abstract';
import { NotificationsTestModule } from '../notifications/notifications.module.test';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    NotificationsTestModule,
    CityTestModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: SubscriptionServiceLookup,
      useExisting: SubscriptionService,
    },
    {
      provide: SubscriptionServiceInterface,
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
  exports: [SubscriptionServiceLookup, SubscriptionServiceInterface, ServiceSubscriptionRepository, GroupSubscriptionRepository],
})
export class SubscriptionTestModule {}
