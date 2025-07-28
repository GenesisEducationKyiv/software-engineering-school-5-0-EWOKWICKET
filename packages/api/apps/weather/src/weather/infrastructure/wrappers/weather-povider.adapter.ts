import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ChainableWeatherProvider } from '../../application/interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from '../../application/interfaces/weather-provider.abstract';
import { Weather } from '../../domain/weather.entity';

export class WeatherProviderAdapter implements WeatherProvider {
  constructor(
    private readonly weatherChain: ChainableWeatherProvider,
    private readonly logger: LoggerInterface,
  ) {}

  async getCurrentWeather(city: string): Promise<Weather> {
    this.logger.debug('Acquiring current weather', { data: { city } });
    return await this.weatherChain.handle(city);
  }
}
