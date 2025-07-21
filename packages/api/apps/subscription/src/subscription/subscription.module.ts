import { GrpcClientsConfigs } from '@common/configs/clients';
import { GrpcServices } from '@common/configs/services';
import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsClient } from 'src/common/clients/interfaces/notifications-client.interface';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';
import { NotificationsGrpcClient } from 'src/common/clients/notifications.grps-client';
import { WeatherGrpcClient } from 'src/common/clients/weather.grpc-client';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from './application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository, ServiceSubscriptionRepository } from './application/interfaces/subscription-repository.abstract';
import { SubscriptionService } from './application/subscription.service';
import { CityExistsConstraint } from './application/validators/city-exists.constraint';
import { SubscriptionRepository } from './infrastructure/persistence/repositories/subscription.repository';
import { Subscription, SubscriptionSchema } from './infrastructure/persistence/schemas/subscription.schema';
import { SubscriptionController } from './presentation/subcription.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
    ]),
    ClientsModule.registerAsync([GrpcClientsConfigs.WEATHER, GrpcClientsConfigs.NOTIFICATIONS]),
  ],
  controllers: [SubscriptionController],
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
      inject: [GrpcClientsConfigs.WEATHER.name],
      useFactory: (client: ClientGrpc): WeatherClient => {
        return new WeatherGrpcClient(client.getService(GrpcServices.WEATHER.name));
      },
    },
    {
      provide: NotificationsClient,
      inject: [GrpcClientsConfigs.NOTIFICATIONS.name],
      useFactory: (client: ClientGrpc): NotificationsClient => {
        return new NotificationsGrpcClient(client.getService(GrpcServices.NOTIFICATIONS.name));
      },
    },
  ],
  exports: [GroupSubscriptionRepository, SubscriptionServiceInterface],
})
export class SubscriptionModule {}
