import { CacheAccessor } from 'src/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/utils/key-transformation';
import { CityCachePrefixes } from 'src/city/constants/enums/city-cache-prefixes.enum';
import { ChainableCityProvider } from 'src/city/interfaces/chainable-city.provider';
import { HOUR } from '../utils/time-units';

export class CityProviderCacheProxy extends ChainableCityProvider {
  constructor(
    private readonly wrapped: ChainableCityProvider,
    private readonly cacheService: CacheAccessor,
  ) {
    super();
  }

  async validateCity(city: string): Promise<boolean> {
    const cacheKey = transformKey(CityCachePrefixes.CITY_VALIDATION, city);
    const cached = await this.cacheService.get<boolean>(cacheKey);
    if (cached) return cached; // cache hit

    const result: boolean = await this.wrapped.handle(city);
    await this.cacheService.set<boolean>(cacheKey, result, HOUR); // cache validation result

    return result;
  }
}
