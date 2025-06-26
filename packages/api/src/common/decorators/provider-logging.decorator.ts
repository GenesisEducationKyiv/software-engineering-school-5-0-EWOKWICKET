import { LoggerService } from 'src/logger/logger.service';
import { ProviderHandler } from '../abstractions/weather-handler.abstract';

export class ProviderLoggingDecorator<Response> extends ProviderHandler<Response> {
  constructor(
    private readonly wrapped: ProviderHandler<Response>,
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

  setNext(handler: ProviderHandler<Response>) {
    this.wrapped.setNext(handler);
    this.next = handler;
    return this;
  }
}
