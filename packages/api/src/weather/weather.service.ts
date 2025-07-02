import { Injectable } from '@nestjs/common';
import { CurrentWeatherResponseDto } from './dtos/current-weather-response.dto';
import { ChainableCurrentWeatherProvider } from './interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from './interfaces/current-weather.abstract';

@Injectable()
export class WeatherService implements WeatherProvider {
  constructor(private readonly currentWeahterProvider: ChainableCurrentWeatherProvider) {}

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return this.currentWeahterProvider.handle(city);
  }
}
