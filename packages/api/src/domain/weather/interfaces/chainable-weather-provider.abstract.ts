import { Chainable } from 'src/common/interfaces/chainable.abstract';
import { Weather } from '../weather.entity';
import { WeatherProvider } from './weather-provider.abstract';

export abstract class ChainableWeatherProvider extends Chainable<string, Weather> implements WeatherProvider {
  async handle(city: string): Promise<Weather> {
    try {
      return await this.getCurrentWeather(city);
    } catch (err) {
      if (this.next) return await this.next.handle(city);
      throw err;
    }
  }

  abstract getCurrentWeather(city: string): Promise<Weather>;
}
