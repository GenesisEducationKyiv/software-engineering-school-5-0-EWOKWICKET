import { WeatherDto } from '@common/contracts/weather/dtos/weather.dto';

export abstract class WeatherClient {
  abstract getCurrentWeather(city: string): Promise<WeatherDto>;
}
