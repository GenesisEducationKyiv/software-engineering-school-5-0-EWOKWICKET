import { CacheAccessor } from '@cache/application/interfaces/cache-service.interface';
import { createCacheKey } from '@cache/application/utils/create-cache-key';
import { HOUR } from '@common/utils/time-units';
import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';
import { CityCachePrefixes } from '../constants/city-cache-prefixes.enum';

export class CityProviderCacheProxy extends ChainableCityProvider {
  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly cacheService: CacheAccessor,
  ) {
    super();
  }

  async cityExists(city: string): Promise<boolean> {
    const cacheKey = createCacheKey(CityCachePrefixes.CITY_VALIDATION, city);
    const cached = await this.cacheService.get<boolean>(cacheKey);
    if (cached) return cached; // cache hit

    const result: boolean = await this.wrapped.handle(city);
    await this.cacheService.set<boolean>(cacheKey, result, HOUR); // cache validation result

    return result;
  }
}
