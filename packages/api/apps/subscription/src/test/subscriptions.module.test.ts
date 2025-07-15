import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from '../subscription/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from '../subscription/application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from '../subscription/application/subscription.service';
import { CityExistsConstraint } from '../subscription/application/validators/city-exists.constraint';
import { Subscription } from '../subscription/domain/subscription.entity';
import { SubscriptionRepository } from '../subscription/infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionSchema } from '../subscription/infrastructure/persistence/schemas/subscription.schema';
import { AppTestModule } from './app.module.test';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    forwardRef(() => AppTestModule),
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
export class SubscriptionTestModule {}
