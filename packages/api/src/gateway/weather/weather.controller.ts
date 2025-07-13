import { Controller, Get, Query } from '@nestjs/common';
import { WeatherFacadePublic } from 'src/common/interfaces/weather-facade.interfaces';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weather: WeatherFacadePublic) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string) {
    return this.weather.getCurrentWeather(city);
  }
}
