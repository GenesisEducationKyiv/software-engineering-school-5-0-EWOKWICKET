import { Controller, Get, Query } from '@nestjs/common';
import { WeatherFacadeInterface } from '../facade/interfaces/weather-facade.interface';

@Controller('weather')
export class WeatherController {
  constructor(private readonly facade: WeatherFacadeInterface) {}

  @Get('current')
  async getCurrentWeather(@Query('city') city: string) {
    return await this.facade.getCurrentWeather(city);
  }

  @Get('cityExists')
  async cityExists(@Query('city') city: string) {
    return await this.facade.cityExists(city);
  }
}
