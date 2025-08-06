import { ClientsConfigs } from '@common/configs/clients';
import { Services } from '@common/configs/services';
import { Module } from '@nestjs/common';
import { ClientGrpc, ClientsModule } from '@nestjs/microservices';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';
import { WeatherGrpcClient } from 'src/common/clients/weather.grpc-client';
import { WeatherController } from './presentation/weather.controller';

@Module({
  imports: [ClientsModule.registerAsync([ClientsConfigs.WEATHER])],
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherClient,
      inject: [ClientsConfigs.WEATHER.name],
      useFactory: (client: ClientGrpc): WeatherClient => {
        return new WeatherGrpcClient(client.getService(Services.WEATHER.name));
      },
    },
  ],
})
export class WeatherModule {}
