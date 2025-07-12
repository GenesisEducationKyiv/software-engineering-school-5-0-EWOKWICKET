import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionFacadeGroup, SubscriptionFacadePublic } from 'src/common/interfaces/subscription-facade.interface';
import { NotificationsServiceModule } from 'src/notifications/notifications-service.module';
import { CityModule } from 'src/weather/city/city.module';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from './application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from './application/interfaces/subscription-repository.abstract';
import { SubscriptionFacade } from './application/subscription.facade';
import { SubscriptionService } from './application/subscription.service';
import { SubscriptionRepository } from './infrastructure/persistence/repositories/subscription.repository';
import { Subscription, SubscriptionSchema } from './infrastructure/persistence/schemas/subscription.schema';
import { SubscriptionController } from './presentation/subscription.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    NotificationsServiceModule,
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
    SubscriptionFacade,
    {
      provide: SubscriptionFacadeGroup,
      useExisting: SubscriptionFacade,
    },
    {
      provide: SubscriptionFacadePublic,
      useExisting: SubscriptionFacade,
    },
  ],
  exports: [SubscriptionFacadeGroup, SubscriptionFacadePublic],
})
export class SubscriptionModule {}
