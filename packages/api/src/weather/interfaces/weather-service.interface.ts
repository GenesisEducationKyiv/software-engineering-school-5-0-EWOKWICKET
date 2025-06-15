import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';

export interface IForecastWeatherService {
  getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto>;
}

export const ForecastWeatherServiceToken = 'ForecastWeatherService';
