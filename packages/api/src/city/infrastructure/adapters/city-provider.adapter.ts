import { ChainableCityProvider } from 'src/city/interfaces/chainable-city.provider';
import { CityProvider } from 'src/city/interfaces/city.provider';

export class CityProviderAdapter implements CityProvider {
  constructor(private readonly chain: ChainableCityProvider) {}

  async validateCity(city: string): Promise<boolean> {
    return await this.chain.handle(city);
  }
}
