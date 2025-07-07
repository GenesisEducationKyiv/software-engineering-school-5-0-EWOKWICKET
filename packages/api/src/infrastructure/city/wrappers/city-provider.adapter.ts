import { ChainableCityProvider } from 'src/application/city/interfaces/chainable-city.provider';
import { CityProvider } from 'src/application/city/interfaces/city-provider.abstract';

export class CityProviderAdapter implements CityProvider {
  constructor(private readonly chain: ChainableCityProvider) {}

  async validateCity(city: string): Promise<boolean> {
    return await this.chain.handle(city);
  }
}
