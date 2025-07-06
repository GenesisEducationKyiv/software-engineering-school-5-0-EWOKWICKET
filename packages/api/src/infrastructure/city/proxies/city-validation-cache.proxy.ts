import { ChainableCityProvider } from 'src/domain/city/chainable-city.provider';
import { CachePrefixes } from 'src/infrastructure/cache/enums/cache-prefixes.enum';
import { CacheTTL } from 'src/infrastructure/cache/enums/cache-ttl.enum';
import { CacheAccessor } from 'src/infrastructure/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/infrastructure/cache/utils/key-transformation';

export class CityProviderCacheProxy extends ChainableCityProvider {
  private readonly keyBase: CachePrefixes = CachePrefixes.CITY_VALIDATION;
  private readonly ttl: CacheTTL = CacheTTL.HOUR_1;

  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly cacheService: CacheAccessor,
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
