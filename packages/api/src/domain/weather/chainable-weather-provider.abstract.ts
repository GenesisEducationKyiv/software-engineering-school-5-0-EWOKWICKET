import { Chainable } from 'src/common/interfaces/chainable.abstract';
import { WeatherResponseDto } from '../../application/weather/dtos/weather-response.dto';
import { WeatherProvider } from './weather-provider.abstract';

export abstract class ChainableWeatherProvider extends Chainable<string, WeatherResponseDto> implements WeatherProvider {
  async handle(city: string): Promise<WeatherResponseDto> {
    try {
      return await this.getCurrentWeather(city);
    } catch (err) {
      if (this.next) return await this.next.handle(city);
      throw err;
    }
  }

  abstract getCurrentWeather(city: string): Promise<WeatherResponseDto>;
}
