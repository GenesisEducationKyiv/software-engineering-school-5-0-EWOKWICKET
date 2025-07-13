import { Controller, Get, Query } from '@nestjs/common';
import { WeatherFacadeInterface } from 'src/common/interfaces/weather-facade.interfaces';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weather: WeatherFacadeInterface) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string) {
    return this.weather.getCurrentWeather(city);
  }
}
