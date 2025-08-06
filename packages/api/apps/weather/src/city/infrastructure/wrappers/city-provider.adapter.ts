import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';
import { CityProvider } from '../../application/interfaces/city-provider.abstract';

export class CityProviderAdapter implements CityProvider {
  constructor(
    private readonly chain: ChainableCityProvider,
    private readonly logger: LoggerInterface,
  ) {}

  async cityExists(city: string): Promise<boolean> {
    this.logger.debug('Validating city', { data: { city } });
    return await this.chain.handle(city);
  }
}
