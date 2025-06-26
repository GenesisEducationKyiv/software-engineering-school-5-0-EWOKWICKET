import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WeatherServiceInterface } from './abstractions/current-weather.abstract';
import { CurrentWeatherResponseDto } from './dtos/current-weather-response.dto';

@Controller('weather')
export class WeatherController {
  constructor(
    @Inject(WeatherServiceInterface)
    private readonly weatherService: WeatherServiceInterface,
  ) {}

  @Get()
  async getCurrentWeather(@Query('city') city: string): Promise<CurrentWeatherResponseDto> {
    return this.weatherService.getCurrentWeather(city);
  }
}
