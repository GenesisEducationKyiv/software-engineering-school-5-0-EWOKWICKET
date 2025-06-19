import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';

export interface WeatherFetchService {
  getCurrentWeatherRaw(city: string): Promise<CurrentWeatherApiResponseDto>;
}

export const WeatherApiServiceToken = 'WeatherApiService';
