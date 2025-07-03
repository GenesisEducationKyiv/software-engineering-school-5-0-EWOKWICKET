import { CachePrefixes } from 'src/cache/enums/cache-prefixes.enum';
import { CacheTTL } from 'src/cache/enums/cache-ttl.enum';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/utils/key-transformation';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from 'src/weather/interfaces/chainable-weather-provider.abstract';

export class WeatherProviderCacheProxy extends ChainableWeatherProvider {
  private readonly keyBase: CachePrefixes = CachePrefixes.CURRENT_WEATHER;
  private readonly ttl: number = CacheTTL.MINUTES_10;

  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const cacheKey = transformKey(this.keyBase, city);
    const cached = await this.cacheService.get<CurrentWeatherResponseDto>(cacheKey);
    if (cached) return cached;

    const result = await this.wrapped.handle(city);
    await this.cacheService.set<CurrentWeatherResponseDto>(cacheKey, result, this.ttl);

    return result;
  }
}
