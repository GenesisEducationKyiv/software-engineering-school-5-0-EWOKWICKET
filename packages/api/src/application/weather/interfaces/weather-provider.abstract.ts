import { Weather } from 'src/domain/weather/weather.entity';

export abstract class WeatherProvider {
  abstract getCurrentWeather(city: string): Promise<Weather>;
}
