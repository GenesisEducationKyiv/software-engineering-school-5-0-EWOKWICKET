import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';

export abstract class WeatherFetch {
  abstract getCurrentWeatherRaw(url: string): Promise<CurrentWeatherResponseDto>;
}
