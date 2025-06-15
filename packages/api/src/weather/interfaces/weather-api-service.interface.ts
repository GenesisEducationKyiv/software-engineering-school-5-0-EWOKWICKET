import { City } from 'src/common/constants/types/city.interface';
import { CurrentWeatherAPI } from 'src/common/constants/types/current-weather-api.interface';

export interface IWeatherApiService {
  searchCitiesRaw(city: string): Promise<City[]>;
  getCurrentWeatherRaw(city: string): Promise<CurrentWeatherAPI>;
}

export const WeatherApiServiceToken = 'WeatherApiService';
