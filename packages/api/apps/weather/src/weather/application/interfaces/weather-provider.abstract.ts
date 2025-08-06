import { Weather } from '../../domain/weather.entity';

export abstract class WeatherProvider {
  abstract getCurrentWeather(city: string): Promise<Weather>;
}
