import { CurrentWeatherApiResponseDto } from 'src/weather/constants/current-weather-api.interface';

export abstract class WeatherFetch {
  abstract getCurrentWeatherRaw(city: string): Promise<CurrentWeatherApiResponseDto>;
}
