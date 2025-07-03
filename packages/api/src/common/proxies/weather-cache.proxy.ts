import { CachePrefixes } from 'src/cache/enums/cache-prefixes.enum';
import { CacheTTL } from 'src/cache/enums/cache-ttl.enum';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/utils/key-transformation';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from 'src/weather/interfaces/chainable-weather-provider.abstract';
import { CityNotFoundException } from '../errors/city-not-found.error';

export class WeatherProviderCacheProxy extends ChainableWeatherProvider {
  private readonly ttl: CacheTTL = CacheTTL.MINUTES_10;

  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    await this.cityExists(city);

    const weatherCacheKey = transformKey(CachePrefixes.CURRENT_WEATHER, city);
    const cached = await this.cacheService.get<CurrentWeatherResponseDto>(weatherCacheKey);
    if (cached) return cached;

    const result = await this.wrapped.handle(city);
    await this.cacheService.set<CurrentWeatherResponseDto>(weatherCacheKey, result, this.ttl);

    return result;
  }

  async cityExists(city: string) {
    const validationCacheKey = transformKey(CachePrefixes.CITY_VALIDATION, city);
    const exists = await this.cacheService.get<boolean>(validationCacheKey);
    if (exists === false) throw new CityNotFoundException();
  }
}
