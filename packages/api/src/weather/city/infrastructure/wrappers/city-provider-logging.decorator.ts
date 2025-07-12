import { ProviderLogger } from 'src/common/logger/interfaces/logger.interface';
import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';

export class CityProviderLoggingDecorator extends ChainableCityProvider {
  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly logger: ProviderLogger,
  ) {
    super();
  }

  async cityExists(city: string): Promise<boolean> {
    const result = await this.wrapped.cityExists(city);
    this.logger.logProvider('City validation', this.wrapped.constructor.name, result);
    return result;
  }
}
