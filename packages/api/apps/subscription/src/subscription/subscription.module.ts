import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from './application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from './application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from './application/subscription.service';
import { CityExistsConstraint } from './application/validators/city-exists.constraint';
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
    forwardRef(() => AppModule),
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
export class SubscriptionModule {}
