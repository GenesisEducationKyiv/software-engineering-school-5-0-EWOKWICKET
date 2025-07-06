import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';

export abstract class WeatherProvider {
  abstract getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto>;
}
