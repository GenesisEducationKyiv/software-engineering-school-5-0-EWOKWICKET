import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsServiceModule } from 'src/notifications/notifications-service.module';
import { WeatherServiceModule } from 'src/weather/weather-service.module';
import { SubscriptionServiceModule } from '../subscription-service.module';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from './application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from './application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from './application/subscription.service';
import { SubscriptionRepository } from './infrastructure/persistence/repositories/subscription.repository';
import { Subscription, SubscriptionSchema } from './infrastructure/persistence/schemas/subscription.schema';
import { CityExistsConstraint } from './infrastructure/validators/city-exists.constraint';
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
    WeatherServiceModule,
    forwardRef(() => SubscriptionServiceModule),
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
export class SubscriptionModule {}
