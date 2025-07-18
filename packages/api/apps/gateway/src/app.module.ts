import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static';
import appConfig from './config/app.config';
import { appEnvSchema } from './config/env.validation';
import { SubscriptionClient } from './subscription/application/interfaces/subscription-client.interface';
import { SubscriptionGrpcClient } from './subscription/infrastructure/subscription.grpc-client';
import { SubscriptionController } from './subscription/presentation/subscription.controller';
import { WeatherClient } from './weather/application/interfaces/weather-client.interface';
import { WeatherGrpcClient } from './weather/infrastructure/weather.grpc-client';
import { WeatherController } from './weather/presentation/weather.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      validationSchema: appEnvSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'packages/public',
      serveRoot: '/weatherapi.app',
      exclude: ['/weatherapi.app/api*'],
    }),
    ClientsModule.register([
      {
        name: 'WEATHER',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50053',
          package: 'weather',
          protoPath: '../../libs/proto/src/weather.proto',
        },
      },
      {
        name: 'SUBSCRIPTION',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50052',
          package: 'subscription',
          protoPath: '../../libs/proto/src/subscription.proto',
        },
      },
    ]),
  ],
  controllers: [SubscriptionController, WeatherController],
  providers: [
    {
      provide: SubscriptionClient,
      useClass: SubscriptionGrpcClient,
    },
    {
      provide: WeatherClient,
      useClass: WeatherGrpcClient,
    },
  ],
})
export class AppModule {}
