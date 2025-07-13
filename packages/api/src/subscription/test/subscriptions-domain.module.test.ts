import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsTestModule } from 'src/notifications/test/notifications.module.test';
import { WeatherTestModule } from 'src/weather/test/weather.module.test';
import { CityExistsConstraint } from '../../common/subscription/validators/city-exists.constraint';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from '../subscriptions/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from '../subscriptions/application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from '../subscriptions/application/subscription.service';
import { Subscription } from '../subscriptions/domain/subscription.entity';
import { SubscriptionRepository } from '../subscriptions/infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionSchema } from '../subscriptions/infrastructure/persistence/schemas/subscription.schema';

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
