import { Controller, Get, Query } from '@nestjs/common';
import { CurrentWeatherResponseDto } from './dtos/current-weather-response.dto';
import { WeatherProvider } from './interfaces/current-weather.abstract';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherProvider: WeatherProvider) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string): Promise<CurrentWeatherResponseDto> {
    return this.weatherProvider.getCurrentWeather(city);
  }
}
