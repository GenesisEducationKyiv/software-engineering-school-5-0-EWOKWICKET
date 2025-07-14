import { Controller, Get, Query } from '@nestjs/common';
import { WeatherFacadePublic } from '../application/interfaces/weather-facade.interfaces';

@Controller('weather')
export class PublicWeatherController {
  constructor(private readonly facade: WeatherFacadePublic) {}

  @Get('current')
  async getCurrentWeather(@Query('city') city: string) {
    return await this.facade.getCurrentWeather(city);
  }
}
