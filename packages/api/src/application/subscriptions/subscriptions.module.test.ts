import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityTestModule } from 'src/application/city/city.module.test';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from 'src/domain/subscription/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from 'src/domain/subscription/interfaces/subscription-repository.abstract';
import { SubscriptionRepository } from 'src/infrastructure/subscription/repositories/subscription.repository';
import { SubscriptionDb, SubscriptionSchema } from 'src/infrastructure/subscription/schemas/subscription.schema';
import { SubscriptionController } from 'src/presentation/subscription.controller';
import { NotificationsTestModule } from '../notifications/notifications.module.test';
import { SubscriptionService } from './services/subscription.service';

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
