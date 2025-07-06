import { ChainableCityProvider } from 'src/city/interfaces/chainable-city.provider';
import { LoggerService } from 'src/logger/logger.service';
import { Loggable } from '../interfaces/loggable.interace';

export class CityProviderLoggingDecorator extends ChainableCityProvider {
  private readonly message: string = 'City validation';

  constructor(
    private readonly wrapped: ChainableCityProvider & Loggable,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async validateCity(city: string): Promise<boolean> {
    const result = await this.wrapped.validateCity(city);
    this.logger.logProviderAction(this.message, this.wrapped.executor, result);
    return result;
  }
}
