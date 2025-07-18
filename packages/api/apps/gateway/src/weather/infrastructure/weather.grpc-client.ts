import { WeatherDto } from '@common/contracts/weather/dtos/weather.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GetCurrentResponse } from '@proto/weather';
import { lastValueFrom } from 'rxjs';
import { WeatherClient } from '../application/interfaces/weather-client.interface';
import { RequestDtoMapper } from './mappers/request-dto.mapper';

@Injectable()
export class WeatherGrpcClient implements WeatherClient, OnModuleInit {
  private weather;

  constructor(@Inject('WEATHER') private readonly weatherClient: ClientGrpc) {}

  async getCurrentWeather(city: string): Promise<WeatherDto> {
    const { weather }: GetCurrentResponse = await lastValueFrom(this.weather.getCurrentWeather({ city }));
    return RequestDtoMapper.toEntity(weather);
  }

  onModuleInit() {
    this.weather = this.weatherClient.getService('WeatherService');
  }
}
