import { Inject } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { ProviderHandler } from '../abstractions/weather-handler.abstract';
import { MINUTE } from '../utils/time-units';

export class CityValidationCacheProxy extends ProviderHandler<boolean> {
  private readonly keyBase: string = 'cityValidation:';
  private readonly ttl: number = 10 * MINUTE;

  constructor(
    @Inject(CacheServiceInterface)
    private readonly wrapped: ProviderHandler<boolean>,
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async process(city: string): Promise<boolean> {
    const cacheKey = `${this.keyBase}${city.toLowerCase()}`;
    const cached = await this.cacheService.get<boolean>(cacheKey);
    if (cached) return cached; // cache hit

    const result: boolean = await this.wrapped.handle(city);
    await this.cacheService.set<boolean>(cacheKey, result, this.ttl); // cache validation result

    return result;
  }

  get providerName(): string {
    return this.wrapped.providerName;
  }

  setNext(handler: ProviderHandler<boolean>) {
    this.wrapped.setNext(handler);
    this.next = handler;
    return this;
  }
}
