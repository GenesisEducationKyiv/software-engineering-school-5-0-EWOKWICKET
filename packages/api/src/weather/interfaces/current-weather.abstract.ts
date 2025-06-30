import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';

export abstract class WeatherServiceInterface {
  abstract getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto>;
}
