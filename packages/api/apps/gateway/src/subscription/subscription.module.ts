import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { SubscriptionClient } from './application/interfaces/subscription-client.interface';
import { SubscriptionGrpcClient } from './infrastructure/subscription.grpc-client';
import { SubscriptionController } from './presentation/subscription.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUBSCRIPTION',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('app.urls.subscription'),
            package: 'subscription',
            protoPath: path.join(__dirname, '..', '..', '..', '..', 'libs', 'proto', 'src', 'subscription.proto'),
          },
        }),
      },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SubscriptionClient,
      inject: ['SUBSCRIPTION'],
      useFactory: (client: ClientGrpc): SubscriptionClient => {
        return new SubscriptionGrpcClient(client.getService('SubscriptionService'));
      },
    },
  ],
})
export class SubscriptionModule {}
