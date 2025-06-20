import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';

export abstract class CurrentWeather {
  abstract getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto>;
}
