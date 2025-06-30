import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CurrentWeatherResponseDto } from './dtos/current-weather-response.dto';
import { WeatherProvider } from './interfaces/current-weather.abstract';

@Controller('weather')
export class WeatherController {
  constructor(
    @Inject(WeatherProvider)
    private readonly weatherService: WeatherProvider,
  ) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string): Promise<CurrentWeatherResponseDto> {
    return this.weatherService.getCurrentWeather(city);
  }
}
