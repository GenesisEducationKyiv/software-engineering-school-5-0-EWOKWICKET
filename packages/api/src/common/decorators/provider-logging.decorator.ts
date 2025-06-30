import { LoggerService } from 'src/logger/logger.service';
import { Chainable } from '../interfaces/weather-handler.abstract';

export class ProviderLoggingDecorator<Response> extends Chainable<Response> {
  constructor(
    private readonly wrapped: Chainable<Response>,
    private readonly logger: LoggerService,
    private readonly message: string,
  ) {
    super();
  }

  async process(city: string): Promise<Response> {
    const result = await this.wrapped.process(city);
    this.logger.logProviderAction(this.message, this.wrapped.providerName, result);
    return result;
  }

  get providerName(): string {
    return this.wrapped.providerName;
  }

  setNext(handler: Chainable<Response>) {
    this.wrapped.setNext(handler);
    this.next = handler;
    return handler;
  }
}
