import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/application/city/city.module';
import { NotificationsModule } from 'src/application/notifications/notifications.module';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from 'src/application/subscriptions/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from 'src/application/subscriptions/interfaces/subscription-repository.abstract';
import { SubscriptionRepository } from 'src/infrastructure/subscription/repositories/subscription.repository';
import { SubscriptionController } from 'src/presentation/subscription.controller';
import { SubscriptionDb, SubscriptionSchema } from '../../infrastructure/subscription/schemas/subscription.schema';
import { SubscriptionService } from './services/subscription.service';

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
