import { Weather } from 'src/weather-api/domain/weather.entity';

export abstract class WeatherFacadeInterface {
  abstract getCurrentWeather(city: string): Promise<Weather>;

  abstract cityExists(city: string): Promise<boolean>;
}
