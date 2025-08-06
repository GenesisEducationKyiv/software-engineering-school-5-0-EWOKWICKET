import { WeatherDto } from '@common/contracts/weather/dtos/weather.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';

@Controller()
export class WeatherController {
  constructor(private readonly weather: WeatherClient) {}

  @Get('weather')
  async getCurrentWeather(@Query('city') city: string): Promise<WeatherDto> {
    return await this.weather.getCurrentWeather(city);
  }
}
