import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from 'src/subscriptions/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from 'src/subscriptions/application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from 'src/subscriptions/application/subscription.service';
import { SubscriptionRepository } from 'src/subscriptions/infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionDb, SubscriptionSchema } from 'src/subscriptions/infrastructure/persistence/schemas/subscription.schema';
import { SubscriptionController } from 'src/subscriptions/presentation/subscription.controller';
import { CityTestModule } from './city.module.test';
import { NotificationsTestModule } from './notifications.module.test';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubscriptionDb.name,
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
