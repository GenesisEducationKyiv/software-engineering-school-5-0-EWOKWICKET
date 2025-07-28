import { Labels } from '@logger/application/constants/log.types';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ChainableWeatherProvider } from '../../application/interfaces/chainable-weather-provider.abstract';
import { Weather } from '../../domain/weather.entity';

export class WeatherProviderLoggingDecorator extends ChainableWeatherProvider {
  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly logger: LoggerInterface,
    private readonly options: { labels: Labels },
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<Weather> {
    const result = await this.wrapped.handle(city);
    const data = { city, ...result };
    this.logger.info('Get current weather', { data, labels: this.options.labels });
    return result;
  }
}
