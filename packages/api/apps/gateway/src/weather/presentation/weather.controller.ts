import { Controller, Get, Query } from '@nestjs/common';
import { WeatherClient } from '../application/interfaces/weather-client.interface';

@Controller()
export class WeatherController {
  constructor(private readonly weather: WeatherClient) {}

  @Get('weather')
  async getCurrentWeather(@Query('city') city: string) {
    return await this.weather.getCurrentWeather(city);
  }
}
