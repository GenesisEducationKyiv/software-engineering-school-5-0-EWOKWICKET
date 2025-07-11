import { Chainable } from 'src/weather/common/interfaces/chainable.abstract';
import { CityProvider } from './city-provider.abstract';

export abstract class ChainableCityProvider extends Chainable<string, boolean> implements CityProvider {
  async handle(city: string): Promise<boolean> {
    try {
      return await this.validateCity(city);
    } catch {
      if (this.next) return await this.next.handle(city);
      return false;
    }
  }

  abstract validateCity(city: string): Promise<boolean>;
}
