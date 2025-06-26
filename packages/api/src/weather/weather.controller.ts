import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CurrentWeatherResponseDto } from './dtos/current-weather-response.dto';
import { CurrentWeather } from './interfaces/current-weather.interface';

@Controller('weather')
export class WeatherController {
  constructor(
    @Inject(CurrentWeather)
    private readonly weatherService: CurrentWeather,
  ) {}

  @Get()
  getCurrentWeather(@Query('city') city: string): Promise<CurrentWeatherResponseDto> {
    return this.weatherService.getCurrentWeather(city);
  }
}
