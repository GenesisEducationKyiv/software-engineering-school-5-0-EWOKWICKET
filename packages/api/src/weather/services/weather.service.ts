import { Inject, Injectable } from '@nestjs/common';
import { CitiesWeatherService } from 'src/subscriptions/interfaces/weather-service.interface';
import { CityResponseDto } from 'src/weather/constants/city-response.dto';
import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherApiService, WeatherApiServiceToken } from '../interfaces/weather-api-service.interface';
import { ForecastWeatherService } from '../interfaces/weather-service.interface';

@Injectable()
export class WeatherService implements CitiesWeatherService, ForecastWeatherService {
  constructor(
    @Inject(WeatherApiServiceToken)
    private readonly weatherApiService: WeatherApiService,
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

  async searchCities(city: string): Promise<string[]> {
    const rawCities: CityResponseDto[] = await this.weatherApiService.searchCitiesRaw(city);
    const cityNames: string[] = rawCities.map((city) => city.name);
    return cityNames;
  }
}
