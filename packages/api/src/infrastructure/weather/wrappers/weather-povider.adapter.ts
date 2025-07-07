import { ChainableWeatherProvider } from 'src/application/weather/interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from 'src/application/weather/interfaces/weather-provider.abstract';
import { Weather } from 'src/domain/weather/weather.entity';

export class WeatherProviderAdapter implements WeatherProvider {
  constructor(private readonly weatherChain: ChainableWeatherProvider) {}

  async getCurrentWeather(city: string): Promise<Weather> {
    return await this.weatherChain.handle(city);
  }
}
