import { Controller, Get, Query } from '@nestjs/common';
import { WeatherProvider } from 'src/domain/weather/interfaces/weather-provider.abstract';
import { Weather } from 'src/domain/weather/weather.entity';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherProvider: WeatherProvider) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string): Promise<Weather> {
    return this.weatherProvider.getCurrentWeather(city);
  }
}
