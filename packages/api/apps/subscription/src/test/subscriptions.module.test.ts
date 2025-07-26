import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsClient } from 'src/common/clients/interfaces/notifications-client.interface';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from '../subscription/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from '../subscription/application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from '../subscription/application/subscription.service';
import { CityExistsConstraint } from '../subscription/application/validators/city-exists.constraint';
import { Subscription } from '../subscription/domain/subscription.entity';
import { SubscriptionRepository } from '../subscription/infrastructure/persistence/repositories/subscription.repository';
import { SubscriptionSchema } from '../subscription/infrastructure/persistence/schemas/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
  ],
  providers: [
    CityExistsConstraint,
    SubscriptionService,
    { provide: SubscriptionServiceLookup, useExisting: SubscriptionService },
    { provide: SubscriptionServiceInterface, useExisting: SubscriptionService },
    SubscriptionRepository,
    { provide: ServiceSubscriptionRepository, useExisting: SubscriptionRepository },
    { provide: GroupSubscriptionRepository, useExisting: SubscriptionRepository },
    {
      provide: WeatherClient,
      useValue: {
        getWeather: jest.fn(),
        cityExists: jest.fn(),
      },
    },
    {
      provide: NotificationsClient,
      useValue: {
        sendConfirmationNotification: jest.fn(),
        sendWeatherUpdateNotification: jest.fn(),
      },
    },
  ],
  exports: [GroupSubscriptionRepository, SubscriptionServiceInterface],
})
export class SubscriptionTestModule {}
