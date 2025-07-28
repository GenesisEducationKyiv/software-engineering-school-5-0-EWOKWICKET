import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';

const protoBasePath = path.join(__dirname, '..', '..', '..', 'proto', 'src');

export const ClientsConfigs = Object.freeze<Record<string, ClientsProviderAsyncOptions>>({
  WEATHER: {
    name: 'WEATHER',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: config.get<string>('clients.weather.url'),
        package: config.get<string>('clients.weather.package'),
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
        url: config.get<string>('clients.subscription.url'),
        package: config.get<string>('clients.subscription.package'),
        protoPath: path.join(protoBasePath, 'subscription.proto'),
      },
    }),
  },
  NOTIFICATIONS: {
    name: 'NOTIFICATIONS',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>('clients.notifications.url')],
        queue: config.get<string>('clients.notifications.queue'),
        exchange: config.get<string>('clients.notifications.exchange'),
        exchangeType: config.get<string>('clients.notifications.exchangeType'),
        queueOptions: {
          durable: true,
        },
      },
    }),
  },
});
