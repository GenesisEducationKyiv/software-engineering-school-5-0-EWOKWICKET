import { WeatherDto } from '@common/contracts/weather/dtos/weather.dto';
import { Injectable } from '@nestjs/common';
import { GetCurrentResponse } from '@proto/weather';
import { lastValueFrom } from 'rxjs';
import { RequestDtoMapper } from 'src/weather/infrastructure/mappers/request-dto.mapper';
import { WeatherClient } from './interfaces/weather-client.interface';

@Injectable()
export class WeatherGrpcClient implements WeatherClient {
  constructor(private readonly weather) {}

  async getCurrentWeather(city: string): Promise<WeatherDto> {
    const { weather }: GetCurrentResponse = await lastValueFrom(this.weather.getCurrentWeather({ city }));
    return RequestDtoMapper.toEntity(weather);
  }
}
