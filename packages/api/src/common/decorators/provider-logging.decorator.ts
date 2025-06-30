import { LoggerService } from 'src/logger/logger.service';
import { Loggable } from '../interfaces/loggable.interace';
import { Chainable } from '../interfaces/weather-handler.abstract';

export class ProviderLoggingDecorator<Request, Response> extends Chainable<Request, Response> {
  constructor(
    private readonly wrapped: Chainable<Request, Response> & Loggable,
    private readonly logger: LoggerService,
    private readonly message: string,
  ) {
    super();
  }

  async handle(data: Request): Promise<Response> {
    try {
      const result = await this.wrapped.handle(data);
      this.logger.logProviderAction(this.message, this.wrapped.executor, result);
      return result;
    } catch (err) {
      if (this.next) return this.next.handle(data);
      throw err;
    }
  }
}
