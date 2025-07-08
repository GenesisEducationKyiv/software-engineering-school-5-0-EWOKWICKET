import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from 'src/application/subscriptions/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from 'src/application/subscriptions/interfaces/subscription-repository.abstract';
import { SubscriptionService } from 'src/application/subscriptions/subscription.service';
import { CityModule } from 'src/infrastructure/city/city.module';
import { SubscriptionRepository } from 'src/infrastructure/subscription/repositories/subscription.repository';
import { SubscriptionController } from 'src/presentation/subscription/subscription.controller';
import { SubscriptionDb, SubscriptionSchema } from '../../infrastructure/subscription/schemas/subscription.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubscriptionDb.name,
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
export class SubscriptionModule {}
