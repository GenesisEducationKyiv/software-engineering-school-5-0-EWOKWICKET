import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';
import { CityProvider } from '../../application/interfaces/city-provider.abstract';

export class CityProviderAdapter implements CityProvider {
  constructor(private readonly chain: ChainableCityProvider) {}

  async cityExists(city: string): Promise<boolean> {
    return await this.chain.handle(city);
  }
}
