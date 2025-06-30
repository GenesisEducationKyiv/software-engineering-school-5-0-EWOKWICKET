import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';

export abstract class Chainable<Response> {
  protected next?: Chainable<Response>;

  async handle(city: string): Promise<Response> {
    try {
      const result = await this.process(city);
      return result;
    } catch (err) {
      if (this.next && (err instanceof ExternalApiException || err instanceof CityNotFoundException)) {
        return await this.next.handle(city);
      }
      throw err;
    }
  }

  abstract process(city: string): Promise<Response>;
  abstract get providerName(): string;

  setNext(handler: Chainable<Response>) {
    this.next = handler;
    return handler;
  }
}
