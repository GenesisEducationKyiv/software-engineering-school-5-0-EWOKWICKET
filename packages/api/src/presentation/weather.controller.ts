import { Controller, Get, Query } from '@nestjs/common';
import { WeatherResponseDto } from 'src/application/weather/dtos/weather-response.dto';
import { WeatherProvider } from 'src/domain/weather/weather-provider.abstract';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherProvider: WeatherProvider) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string): Promise<WeatherResponseDto> {
    return this.weatherProvider.getCurrentWeather(city);
  }
}
