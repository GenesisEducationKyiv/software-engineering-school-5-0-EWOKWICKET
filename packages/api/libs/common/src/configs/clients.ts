import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';

const protoBasePath = path.join(__dirname, '..', '..', '..', 'proto', 'src');

export const GrpcClientsConfigs = Object.freeze<Record<string, ClientsProviderAsyncOptions>>({
  WEATHER: {
    name: 'WEATHER',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('app.urls.weather'),
        package: 'weather',
        protoPath: path.join(protoBasePath, 'weather.proto'),
      },
    }),
  },
  SUBSCRIPTION: {
    name: 'SUBSCRIPTION',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('app.urls.subscription'),
        package: 'subscription',
        protoPath: path.join(protoBasePath, 'subscription.proto'),
      },
    }),
  },
  NOTIFICATIONS: {
    name: 'NOTIFICATIONS',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('app.urls.notifications'),
        package: 'notifications',
        protoPath: path.join(protoBasePath, 'notifications.proto'),
      },
    }),
  },
});
