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
        url: `${config.get<string>('app.host')}:${config.get<string>('app.grpc.port')}`,
        package: config.get<string>('app.grpc.package'),
        protoPath: path.join(protoBasePath, 'weather.proto'),
      },
    }),
  },
  SUBSCRIPTION: {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: `${config.get<string>('app.host')}:${config.get<string>('app.grpc.port')}`,
        package: config.get<string>('app.grpc.package'),
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
        queue: config.get<string>('app.queue'),
        exchange: config.get<string>('app.exchange'),
        exchangeType: config.get<string>('app.exchangeType'),
        routingKey: config.get<string>('app.routingKey'),
        persistent: true,
        noAck: false,
        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': `${config.get<string>('app.queue')}.retry`,
          },
        },
      },
    }),
  },
});
