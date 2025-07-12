import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsServiceTestModule } from 'src/notifications/test/notifications-service.module.test';
import { WeatherServiceTestModule } from 'src/weather/test/weather-service.module.test';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from '../subscriptions/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from '../subscriptions/application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from '../subscriptions/application/subscription.service';
import { Subscription } from '../subscriptions/domain/subscription.entity';
import { SubscriptionRepository } from '../subscriptions/infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionSchema } from '../subscriptions/infrastructure/persistence/schemas/subscription.schema';
import { CityExistsConstraint } from '../subscriptions/infrastructure/validators/city-exists.constraint';
import { SubscriptionController } from '../subscriptions/presentation/subscription.controller';
import { SubscriptionServiceTestModule } from './subscription-service.module.test';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    NotificationsServiceTestModule,
    WeatherServiceTestModule,
    forwardRef(() => SubscriptionServiceTestModule),
  ],
  controllers: [SubscriptionController],
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
export class SubscriptionTestModule {}
