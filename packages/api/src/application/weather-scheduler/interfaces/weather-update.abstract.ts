import { WeatherUpdateOptions } from '../types/weather-update.options';

export abstract class WeatherUpdate {
  abstract sendUpdates(data: WeatherUpdateOptions): Promise<void>;
}
