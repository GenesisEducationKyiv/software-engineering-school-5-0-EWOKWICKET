import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import appConfig from './config/app.config';
import { appEnvSchema } from './config/env.validation';
import urlsConfig from './config/urls.config';
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
      load: [appConfig, urlsConfig],
      validationSchema: appEnvSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'packages/public',
      serveRoot: '/weatherapi.app',
      exclude: ['/weatherapi.app/api*'],
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
        name: 'SUBSCRIPTION',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('app.subscription'),
            package: 'subscription',
            protoPath: path.join(__dirname, '..', '..', '..', 'libs', 'proto', 'src', 'subscription.proto'),
          },
        }),
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
