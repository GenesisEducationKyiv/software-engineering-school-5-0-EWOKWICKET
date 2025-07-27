import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';

export class CityProviderLoggingDecorator extends ChainableCityProvider {
  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly logger: LoggerInterface,
  ) {
    super();
  }

  async cityExists(city: string): Promise<boolean> {
    const result = await this.wrapped.cityExists(city);
    const logData = { city, exists: result };
    this.logger.info('City validation', logData);
    return result;
  }
}
