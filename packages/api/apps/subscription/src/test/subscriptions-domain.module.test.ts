import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsTestModule } from 'src/notifications/src/test/notifications.module.test';
import { WeatherTestModule } from 'src/weather/src/test/weather.module.test';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from '../subscription-domain/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from '../subscription-domain/application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from '../subscription-domain/application/subscription.service';
import { CityExistsConstraint } from '../subscription-domain/application/validators/city-exists.constraint';
import { Subscription } from '../subscription-domain/domain/subscription.entity';
import { SubscriptionRepository } from '../subscription-domain/infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionSchema } from '../subscription-domain/infrastructure/persistence/schemas/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    NotificationsTestModule,
    WeatherTestModule,
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
export class SubscriptionDomainTestModule {}
