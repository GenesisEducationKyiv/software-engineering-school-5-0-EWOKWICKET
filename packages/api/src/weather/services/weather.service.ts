import { Inject, Injectable } from '@nestjs/common';
import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { CurrentWeather } from '../interfaces/current-weather.interface';
import { WeatherFetch } from '../interfaces/weather-fetch.interface';

@Injectable()
export class WeatherService implements CurrentWeather {
  constructor(
    @Inject(WeatherFetch)
    private readonly weatherApiService: WeatherFetch,
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
