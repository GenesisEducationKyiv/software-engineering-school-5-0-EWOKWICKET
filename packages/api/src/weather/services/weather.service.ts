import { Inject, Injectable } from '@nestjs/common';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherProviderChain } from '../factories/weather.factory';
import { ChainableWeatherProvider } from '../interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from '../interfaces/current-weather.abstract';

@Injectable()
export class WeatherService implements WeatherProvider {
  constructor(
    @Inject(WeatherProviderChain)
    private readonly chain: ChainableWeatherProvider,
  ) {}

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return this.chain.handle(city);
  }
}
