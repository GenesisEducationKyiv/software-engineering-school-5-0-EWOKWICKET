import { ConfigService } from '@nestjs/config';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';

const protoBasePath = path.join(__dirname, '..', '..', '..', 'proto', 'src');

export const ServersConfigs = Object.freeze<Record<string, AsyncMicroserviceOptions>>({
  WEATHER: {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: `${config.get<string>('app.host')}:${config.get<string>('app.port')}`,
        package: 'weather',
        protoPath: path.join(protoBasePath, 'weather.proto'),
      },
    }),
  },
  SUBSCRIPTION: {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: `${config.get<string>('app.host')}:${config.get<string>('app.port')}`,
        package: 'subscription',
        protoPath: path.join(protoBasePath, 'subscription.proto'),
      },
    }),
  },
  NOTIFICATIONS: {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>('app.rmqUrl')],
        queue: 'notifications',
        exchange: 'notifications',
        exchangeType: 'topic',
        routingKey: 'notifications.*',
        persistent: true,
        noAck: false,
      },
    }),
  },
});
