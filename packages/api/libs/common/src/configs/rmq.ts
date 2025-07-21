import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';

export const RmqNotificationsConfig = Object.freeze<Record<string, ClientsProviderAsyncOptions>>({
  NOTIFICATIONS: {
    name: 'NOTIFICATIONS',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>('app.urls.rmqUrl')],
        queue: 'notifications',
        exchange: 'notifications',
        exchangeType: 'topic',
        queueOptions: {
          durable: true,
        },
      },
    }),
  },
});
