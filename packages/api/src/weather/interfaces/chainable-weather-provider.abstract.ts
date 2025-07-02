import { Chainable } from 'src/common/interfaces/chainable.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherProvider as CurrentWeatherProvider } from './current-weather.abstract';

export abstract class ChainableCurrentWeatherProvider extends Chainable<string, CurrentWeatherResponseDto> implements CurrentWeatherProvider {
  async handle(city: string): Promise<CurrentWeatherResponseDto> {
    try {
      return await this.getCurrentWeather(city);
    } catch (err) {
      if (this.next) return await this.next.handle(city);
      throw err;
    }
  }

  abstract getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto>;
}
