import { Weather } from '../weather.entity';

export abstract class WeatherProvider {
  abstract getCurrentWeather(city: string): Promise<Weather>;
}
