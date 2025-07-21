import { GrpcClientsConfigs } from '@common/configs/clients';
import { RmqNotificationsConfig } from '@common/configs/rmq';
import { GrpcServices } from '@common/configs/services';
import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsClient } from 'src/common/clients/interfaces/notifications-client.interface';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';
import { NotificationsMessageClient } from 'src/common/clients/notifications.message-client';
import { WeatherGrpcClient } from 'src/common/clients/weather.grpc-client';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { WeatherUpdateInterface } from './application/interfaces/weather-update.abstract';
import { SchedulerService } from './application/scheduler.service';
import { WeatherUpdateService } from './infrastructure/weather-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), ClientsModule.registerAsync([GrpcClientsConfigs.WEATHER, RmqNotificationsConfig.NOTIFICATIONS]), SubscriptionModule],
  providers: [
    SchedulerService,
    {
      provide: WeatherUpdateInterface,
      useClass: WeatherUpdateService,
    },
    {
      provide: WeatherClient,
      inject: [GrpcClientsConfigs.WEATHER.name],
      useFactory: (client: ClientGrpc): WeatherClient => {
        return new WeatherGrpcClient(client.getService(GrpcServices.WEATHER.name));
      },
    },
    {
      provide: NotificationsClient,
      useClass: NotificationsMessageClient,
    },
  ],
})
export class SchedulerModule {}
