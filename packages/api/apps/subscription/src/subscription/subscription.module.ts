import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
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
    ClientsModule.registerAsync([
      {
        name: 'WEATHER',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('app.weather'),
            package: 'weather',
            protoPath: path.join(__dirname, '..', '..', '..', '..', 'libs', 'proto', 'src', 'weather.proto'),
          },
        }),
      },
      {
        name: 'NOTIFICATIONS',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('app.notifications'),
            package: 'notifications',
            protoPath: path.join(__dirname, '..', '..', '..', '..', 'libs', 'proto', 'src', 'notifications.proto'),
          },
        }),
      },
    ]),
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
      inject: ['WEATHER'],
      useFactory: (client: ClientGrpc): WeatherClient => {
        return new WeatherGrpcClient(client.getService('WeatherService'));
      },
    },
    {
      provide: NotificationsClient,
      inject: ['NOTIFICATIONS'],
      useFactory: (client: ClientGrpc): NotificationsClient => {
        return new NotificationsGrpcClient(client.getService('NotificationsService'));
      },
    },
  ],
  exports: [GroupSubscriptionRepository, SubscriptionServiceInterface],
})
export class SubscriptionModule {}
