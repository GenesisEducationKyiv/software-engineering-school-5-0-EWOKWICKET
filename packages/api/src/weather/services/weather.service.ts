import { Inject, Injectable } from '@nestjs/common';
import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherApiServiceToken, WeatherFetchService } from '../interfaces/weather-api-service.interface';
import { ForecastWeatherService } from '../interfaces/weather-service.interface';

@Injectable()
export class WeatherService implements ForecastWeatherService {
  constructor(
    @Inject(WeatherApiServiceToken)
    private readonly weatherApiService: WeatherFetchService,
  ) {}

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const rawWeather: CurrentWeatherApiResponseDto = await this.weatherApiService.getCurrentWeatherRaw(city);
    const current = rawWeather.current;

    const result: CurrentWeatherResponseDto = {
      temperature: current.temp_c,
      humidity: current.humidity,
      description: current.condition.text,
    };

    return result;
  }
}
