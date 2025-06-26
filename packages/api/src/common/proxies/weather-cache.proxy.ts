import { Inject } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { CachePrefixes } from 'src/cache/enums/cache-prefixes.enum';
import { CacheTTL } from 'src/cache/enums/cache-ttl.enum';
import { ProviderHandler } from '../abstractions/weather-handler.abstract';

export class WeatherCacheProxy<Response> extends ProviderHandler<Response> {
  private readonly keyBase: CachePrefixes = CachePrefixes.CURRENT_WEATHER;
  private readonly ttl: number = CacheTTL.MINUTES_10;

  constructor(
    private readonly wrapped: ProviderHandler<Response>,
    @Inject(CacheServiceInterface)
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async process(city: string): Promise<Response> {
    const cacheKey = this.transformKey(city);
    const cached = await this.cacheService.get<Response>(cacheKey);
    if (cached) return cached;

    const result = await this.wrapped.handle(city);
    await this.cacheService.set<Response>(cacheKey, result, this.ttl);

    return result;
  }

  private transformKey(city: string) {
    return `${this.keyBase}${city.toLowerCase()}`;
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
