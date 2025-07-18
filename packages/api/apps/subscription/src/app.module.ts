import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationsClient } from './clients/interfaces/notifications-client.interface';
import { WeatherClient } from './clients/interfaces/weather-client.interface';
import { NotificationsGrpcClient } from './clients/notifications.grps-client';
import { WeatherGrpcClient } from './clients/weather.grpc-client';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { subscriptionEnvSchema } from './config/env.validation';
import urlsConfig from './config/urls.config';
import { DatabaseModule } from './database/database.module';
import { SubscriptionFacadeInterface } from './facade/interfaces/subscription-facade.interface';
import { SubscriptionFacade } from './facade/subscription.facade';
import { SubscriptionController } from './presentation/subcription.controller';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, urlsConfig],
      validationSchema: subscriptionEnvSchema,
    }),
    ClientsModule.registerAsync([
      {
        name: 'WEATHER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('urls.weather'),
            package: 'weather',
            protoPath: '../../libs/proto/src/weather.proto',
          },
        }),
      },
      {
        name: 'NOTIFICATIONS',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('urls.notifications'),
            package: 'notifications',
            protoPath: '../../libs/proto/src/notifications.proto',
          },
        }),
      },
    ]),
    DatabaseModule,
    SubscriptionModule,
    SchedulerModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    { provide: SubscriptionFacadeInterface, useClass: SubscriptionFacade },
    { provide: WeatherClient, useClass: WeatherGrpcClient },
    { provide: NotificationsClient, useClass: NotificationsGrpcClient },
  ],
  exports: [SubscriptionFacadeInterface, WeatherClient, NotificationsClient],
})
export class AppModule {}
