import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityExistsConstraint } from 'src/common/subscription/validators/city-exists.constraint';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { WeatherModule } from 'src/weather/weather.module';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from './application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from './application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from './application/subscription.service';
import { SubscriptionRepository } from './infrastructure/persistence/repositories/subscription.repository';
import { Subscription, SubscriptionSchema } from './infrastructure/persistence/schemas/subscription.schema';

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
  providers: [
    CityExistsConstraint,
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
  exports: [GroupSubscriptionRepository, SubscriptionServiceInterface],
})
export class SubscriptionDomainModule {}
