import { Chainable } from '@common/interfaces/chainable.abstract';
import { CityProvider } from './city-provider.abstract';

export abstract class ChainableCityProvider extends Chainable<string, boolean> implements CityProvider {
  async handle(city: string): Promise<boolean> {
    try {
      return await this.cityExists(city);
    } catch {
      if (this.next) return await this.next.handle(city);
      return false;
    }
  }

  abstract cityExists(city: string): Promise<boolean>;
}
