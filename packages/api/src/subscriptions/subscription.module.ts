import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from './application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from './application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from './application/subscription.service';
import { SubscriptionRepository } from './infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionDb, SubscriptionSchema } from './infrastructure/persistence/schemas/subscription.schema';
import { SubscriptionController } from './presentation/subscription.controller';

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
