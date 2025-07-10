import { ProviderLogger } from 'src/common/logger/interfaces/logger.interface';
import { ChainableWeatherProvider } from '../../application/interfaces/chainable-weather-provider.abstract';
import { Weather } from '../../domain/weather.entity';

export class WeatherProviderLoggingDecorator extends ChainableWeatherProvider {
  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly logger: ProviderLogger,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<Weather> {
    const result = await this.wrapped.handle(city);
    this.logger.logProvider('Current weather', this.wrapped.constructor.name, result);
    return result;
  }
}
