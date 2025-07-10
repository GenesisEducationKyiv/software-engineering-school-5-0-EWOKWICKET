import { CacheAccessor } from 'src/cache/application/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/infrastructure/utils/key-transformation';
import { HOUR } from 'src/common/utils/time-units';
import { CityCachePrefixes } from '../../application/constants/weather-cache-prefixes.enum';
import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';

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
