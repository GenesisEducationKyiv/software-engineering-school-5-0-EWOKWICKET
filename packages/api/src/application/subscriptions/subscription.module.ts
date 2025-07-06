import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/application/city/city.module';
import { NotificationsModule } from 'src/application/notifications/notifications.module';
import { SubscriptionRepository } from 'src/infrastructure/subscription/repositories/subscription.repository';
import { SubscriptionController } from 'src/presentation/subscription.controller';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from '../../domain/subscription/services/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from '../../domain/subscription/services/subscription-repository.abstract';
import { Subscription, SubscriptionSchema } from '../../infrastructure/subscription/schemas/subscription.schema';
import { SubscriptionService } from './services/subscription.service';

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
