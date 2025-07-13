import { ChainableWeatherProvider } from '../../application/interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from '../../application/interfaces/weather-provider.abstract';
import { Weather } from '../../domain/weather.entity';

export class WeatherProviderAdapter implements WeatherProvider {
  constructor(private readonly weatherChain: ChainableWeatherProvider) {}

  async getCurrentWeather(city: string): Promise<Weather> {
    return await this.weatherChain.handle(city);
  }
}
