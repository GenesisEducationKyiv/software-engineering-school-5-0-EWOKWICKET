import { ChainableCityProvider } from 'src/domain/city/chainable-city.provider';
import { CityProvider } from 'src/domain/city/city-provider.abstract';

export class CityProviderAdapter implements CityProvider {
  constructor(private readonly chain: ChainableCityProvider) {}

  async validateCity(city: string): Promise<boolean> {
    return await this.chain.handle(city);
  }
}
