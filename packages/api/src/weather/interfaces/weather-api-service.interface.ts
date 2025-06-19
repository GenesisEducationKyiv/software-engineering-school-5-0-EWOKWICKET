import { CityResponseDto } from 'src/weather/constants/city-response.dto';
import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';

export interface WeatherApiService {
  searchCitiesRaw(city: string): Promise<CityResponseDto[]>;
  getCurrentWeatherRaw(city: string): Promise<CurrentWeatherApiResponseDto>;
}

export const WeatherApiServiceToken = 'WeatherApiService';
