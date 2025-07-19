import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { NotificationsClient } from './clients/interfaces/notifications-client.interface';
import { WeatherClient } from './clients/interfaces/weather-client.interface';
import { NotificationsMessageClient } from './clients/notifications.message-client';
import { WeatherGrpcClient } from './clients/weather.grpc-client';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { subscriptionEnvSchema } from './config/env.validation';
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
      load: [appConfig, databaseConfig],
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
            url: config.get<string>('app.weather'),
            package: 'weather',
            protoPath: path.join(__dirname, '..', '..', '..', 'libs', 'proto', 'src', 'weather.proto'),
          },
        }),
      },
      {
        name: 'NOTIFICATIONS',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('app.rmqUrl')],
            queue: 'notifications',
            exchange: 'notifications',
            exchangeType: 'topic',
            queueOptions: {
              durable: true,
            },
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
    { provide: NotificationsClient, useClass: NotificationsMessageClient },
  ],
  exports: [SubscriptionFacadeInterface, WeatherClient, NotificationsClient],
})
export class AppModule {}
