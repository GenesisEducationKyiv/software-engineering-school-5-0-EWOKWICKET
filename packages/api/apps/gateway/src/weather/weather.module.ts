import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';
import { WeatherGrpcClient } from 'src/common/clients/weather.grpc-client';
import { WeatherController } from './presentation/weather.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WEATHER',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('app.urls.weather'),
            package: 'weather',
            protoPath: path.join(__dirname, '..', '..', '..', '..', 'libs', 'proto', 'src', 'weather.proto'),
          },
        }),
      },
    ]),
  ],
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherClient,
      inject: ['WEATHER'],
      useFactory: (client: ClientGrpc): WeatherClient => {
        return new WeatherGrpcClient(client.getService('WeatherService'));
      },
    },
  ],
})
export class WeatherModule {}
