import { Labels } from '@logger/application/constants/log.types';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';

export class CityProviderLoggingDecorator extends ChainableCityProvider {
  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly logger: LoggerInterface,
    private readonly options: { labels: Labels },
  ) {
    super();
  }

  async cityExists(city: string): Promise<boolean> {
    const result = await this.wrapped.cityExists(city);
    const data = { city, exists: result };
    this.logger.info('City validation', { data, labels: this.options.labels });
    return result;
  }
}
