import { ProviderHandler } from '../abstractions/weather-handler.abstract';

export class ProviderLoggingDecorator<Response> extends ProviderHandler<Response> {
  constructor(private readonly wrapped: ProviderHandler<Response>) {
    super();
  }

  async process(city: string): Promise<Response> {
    const result = await this.wrapped.process(city);
    console.log(`Provider: ${this.wrapped.providerName}`);
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
