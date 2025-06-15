import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CurrentWeatherResponseDto } from './dtos/current-weather-response.dto';
import { ForecastWeatherServiceToken, IForecastWeatherService } from './interfaces/weather-service.interface';

@Controller('weather')
export class WeatherController {
  constructor(
    @Inject(ForecastWeatherServiceToken)
    private readonly weatherService: IForecastWeatherService,
  ) {}

  @Get()
  getCurrentWeather(@Query('city') city: string): Promise<CurrentWeatherResponseDto> {
    return this.weatherService.getCurrentWeather(city);
  }
}
