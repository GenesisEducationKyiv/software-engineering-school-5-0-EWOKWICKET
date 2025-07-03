import { CachePrefixes } from 'src/cache/enums/cache-prefixes.enum';
import { CacheTTL } from 'src/cache/enums/cache-ttl.enum';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/utils/key-transformation';
import { ChainableCityProvider } from 'src/city/interfaces/chainable-city.provider';

export class CityProviderCacheProxy extends ChainableCityProvider {
  private readonly keyBase: CachePrefixes = CachePrefixes.CITY_VALIDATION;
  private readonly ttl: number = CacheTTL.HOUR_1;

  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async validateCity(city: string): Promise<boolean> {
    const cacheKey = transformKey(this.keyBase, city);
    const cached = await this.cacheService.get<boolean>(cacheKey);
    if (cached) return cached; // cache hit

    const result: boolean = await this.wrapped.handle(city);
    await this.cacheService.set<boolean>(cacheKey, result, this.ttl); // cache validation result

    return result;
  }
}
