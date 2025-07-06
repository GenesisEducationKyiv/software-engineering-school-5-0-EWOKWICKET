import { WeatherResponseDto } from '../../application/weather/dtos/weather-response.dto';

export abstract class WeatherProvider {
  abstract getCurrentWeather(city: string): Promise<WeatherResponseDto>;
}
