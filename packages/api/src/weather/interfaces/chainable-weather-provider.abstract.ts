import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherProvider } from './current-weather.abstract';

export abstract class ChainableWeatherProvider extends Chainable<string, CurrentWeatherResponseDto> implements WeatherProvider {
  async handle(city: string): Promise<CurrentWeatherResponseDto> {
    try {
      return await this.getCurrentWeather(city);
    } catch {
      if (this.next) return await this.next.handle(city);
      throw new CityNotFoundException();
    }
  }

  abstract getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto>;
}
