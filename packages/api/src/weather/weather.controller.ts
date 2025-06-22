import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CurrentWeatherResponseDto } from './dtos/current-weather-response.dto';
import { WeatherServiceInterface } from './interfaces/current-weather.interface';

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
