import { Inject } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { CachePrefixes } from 'src/cache/enums/cache-prefixes.enum';
import { CacheTTL } from 'src/cache/enums/cache-ttl.enum';
import { ProviderHandler } from '../abstractions/weather-handler.abstract';

export class CityValidationCacheProxy extends ProviderHandler<boolean> {
  private readonly keyBase: CachePrefixes = CachePrefixes.CITY_VALIDATION;
  private readonly ttl: number = CacheTTL.MINUTES_10;

  constructor(
    private readonly wrapped: ProviderHandler<boolean>,
    @Inject(CacheServiceInterface)
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async process(city: string): Promise<boolean> {
    const cacheKey = this.transformKey(city);
    const cached = await this.cacheService.get<boolean>(cacheKey);
    if (cached) return cached; // cache hit

    const result: boolean = await this.wrapped.handle(city);
    await this.cacheService.set<boolean>(cacheKey, result, this.ttl); // cache validation result

    return result;
  }

  private transformKey(city: string) {
    return `${this.keyBase}${city.toLowerCase()}`;
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
