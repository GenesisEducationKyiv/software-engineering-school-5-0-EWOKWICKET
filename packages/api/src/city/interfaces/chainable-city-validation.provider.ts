import { Chainable } from 'src/common/interfaces/weather-handler.abstract';
import { CityValidation } from './city-validation.provider';

export abstract class ChainableCityValidation extends Chainable<string, boolean> implements CityValidation {
  async handle(city: string): Promise<boolean> {
    try {
      return this.validateCity(city);
    } catch (err) {
      if (this.next) return await this.next.handle(city);
      throw err;
    }
  }

  abstract validateCity(city: string): Promise<boolean>;
}
