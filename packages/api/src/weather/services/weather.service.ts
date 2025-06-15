import { Inject, Injectable } from '@nestjs/common';
import { City } from 'src/common/constants/types/city.interface';
import { CurrentWeatherAPI } from 'src/common/constants/types/current-weather-api.interface';
import { ICitiesWeatherService } from 'src/subscriptions/interfaces/weather-service.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { IWeatherApiService, WeatherApiServiceToken } from '../interfaces/weather-api-service.interface';
import { IForecastWeatherService } from '../interfaces/weather-service.interface';

@Injectable()
export class WeatherService implements ICitiesWeatherService, IForecastWeatherService {
  constructor(
    @Inject(WeatherApiServiceToken)
    private readonly weatherApiService: IWeatherApiService,
  ) {}

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const rawWeather: CurrentWeatherAPI = await this.weatherApiService.getCurrentWeatherRaw(city);
    const current = rawWeather.current;

    const result: CurrentWeatherResponseDto = {
      temperature: current.temp_c,
      humidity: current.humidity,
      description: current.condition.text,
    };

    return result;
  }

  async searchCities(city: string): Promise<string[]> {
    const rawCities: City[] = await this.weatherApiService.searchCitiesRaw(city);
    const cityNames: string[] = rawCities.map((city) => city.name);
    return cityNames;
  }
}
