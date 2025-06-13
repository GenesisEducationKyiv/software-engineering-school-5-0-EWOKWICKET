import { Injectable } from '@nestjs/common';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherApiService } from './weather-api.service';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApiService: WeatherApiService) {}

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const rawWeather = await this.weatherApiService.getCurrentWeatherRaw(city);
    const current = rawWeather.current;

    const result: CurrentWeatherResponseDto = {
      temperature: current.temp_c,
      humidity: current.humidity,
      description: current.condition.text,
    };

    return result;
  }

  async searchCities(city: string): Promise<string[]> {
    const rawCities = await this.weatherApiService.searchCitiesRaw(city);
    const cityNames: string[] = rawCities.reduce((cities, cityInfo) => {
      if (!cities.includes(cityInfo.name)) cities.push(cityInfo.name);
      return cities;
    }, []);

    return cityNames;
  }
}
