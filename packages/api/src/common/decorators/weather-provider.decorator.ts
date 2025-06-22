import { ProviderHandler } from '../interfaces/weather-handler.interface';

export class ProviderLoggingDecorator<Response> extends ProviderHandler<Response> {
  constructor(private readonly wrapped: ProviderHandler<Response>) {
    super();
  }

  async fetch(city: string): Promise<Response> {
    const result = await this.wrapped.fetch(city);
    console.log(`Provider: ${this.wrapped.providerName}`);
    return result;
  }

  get providerName(): string {
    return this.wrapped.providerName;
  }

  setNext(handler: ProviderHandler<Response>) {
    this.next = this.wrapped.setNext(handler);
    return this;
  }
}
