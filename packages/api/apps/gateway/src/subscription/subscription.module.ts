import { GrpcClientsConfigs } from '@common/configs/clients';
import { GrpcServices } from '@common/configs/services';
import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule } from '@nestjs/microservices';
import { SubscriptionClient } from './application/interfaces/subscription-client.interface';
import { SubscriptionGrpcClient } from './infrastructure/subscription.grpc-client';
import { SubscriptionController } from './presentation/subscription.controller';

@Module({
  imports: [ClientsModule.registerAsync([GrpcClientsConfigs.SUBSCRIPTION])],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SubscriptionClient,
      inject: [GrpcClientsConfigs.SUBSCRIPTION.name],
      useFactory: (client: ClientGrpc): SubscriptionClient => {
        return new SubscriptionGrpcClient(client.getService(GrpcServices.SUBSCRIPTION.name));
      },
    },
  ],
})
export class SubscriptionModule {}
