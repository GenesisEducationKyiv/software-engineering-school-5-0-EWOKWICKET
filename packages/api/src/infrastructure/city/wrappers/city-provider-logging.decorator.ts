import { ChainableCityProvider } from 'src/application/city/interfaces/chainable-city.provider';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

export class CityProviderLoggingDecorator extends ChainableCityProvider {
  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async validateCity(city: string): Promise<boolean> {
    const result = await this.wrapped.validateCity(city);
    this.logger.logProvider('City validation', this.wrapped.constructor.name, result);
    return result;
  }
}
