import { Controller, Get, Query } from '@nestjs/common';
import { WeatherProvider } from '../application/interfaces/weather-provider.abstract';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherProvider: WeatherProvider) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string) {
    return this.weatherProvider.getCurrentWeather(city);
  }
}
