import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import * as path from 'path';
import { NotificationsClient } from 'src/common/clients/interfaces/notifications-client.interface';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';
import { NotificationsGrpcClient } from 'src/common/clients/notifications.grps-client';
import { WeatherGrpcClient } from 'src/common/clients/weather.grpc-client';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { SchedulerService } from './application/scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    SubscriptionModule,
  ],
  providers: [
    SchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
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
})
export class SchedulerModule {}
