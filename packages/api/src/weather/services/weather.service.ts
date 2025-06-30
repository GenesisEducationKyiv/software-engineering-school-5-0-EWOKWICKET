import { Inject, Injectable } from '@nestjs/common';
import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherServiceInterface } from '../interfaces/current-weather.abstract';
import { ProviderChain } from './weather.factory';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject(ProviderChain)
    private readonly chain: Chainable<CurrentWeatherResponseDto>,
  ) {}

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return this.chain.handle(city);
  }
}
