import { WeatherUpdateOptions } from '../types/weather-update.options';

export abstract class WeatherUpdateInterface {
  abstract sendUpdates(data: WeatherUpdateOptions): Promise<void>;
}
