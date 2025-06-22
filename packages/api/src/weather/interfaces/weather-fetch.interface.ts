import { CurrentOpenWeatherFetchDto, CurrentWeatherApiFetchDto } from '../types/current-weather-api.type';

export abstract class WeatherFetch {
  abstract getCurrentWeatherRaw(url: string): Promise<CurrentWeatherApiFetchDto | CurrentOpenWeatherFetchDto>;
}
