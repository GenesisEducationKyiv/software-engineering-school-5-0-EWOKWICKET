import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { CityValidation } from './city-validation.provider';

export abstract class ChainableCityValidation extends Chainable<string, boolean> implements CityValidation {
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
