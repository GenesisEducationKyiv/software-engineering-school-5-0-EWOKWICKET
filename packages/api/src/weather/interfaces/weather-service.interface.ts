import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';

export interface ForecastWeatherService {
  getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto>;
}

export const ForecastWeatherServiceToken = 'ForecastWeatherService';
