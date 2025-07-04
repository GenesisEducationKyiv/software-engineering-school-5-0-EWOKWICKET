import { CachePrefixes } from 'src/cache/enums/cache-prefixes.enum';
import { CacheTTL } from 'src/cache/enums/cache-ttl.enum';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/utils/key-transformation';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from 'src/weather/interfaces/chainable-weather-provider.abstract';
import { CityNotFoundException } from '../errors/city-not-found.error';

export class WeatherProviderCacheProxy extends ChainableWeatherProvider {
  private readonly weatherTtl: CacheTTL = CacheTTL.MINUTES_10;
  private readonly cityTtl: CacheTTL = CacheTTL.HOUR_1;

  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const cityCacheKey = transformKey(CachePrefixes.CITY_VALIDATION, city); // city cache key
    await this.cityExists(cityCacheKey);

    const weatherCacheKey = transformKey(CachePrefixes.CURRENT_WEATHER, city); // weather cache key
    const cachedWeather = await this.cacheService.get<CurrentWeatherResponseDto>(weatherCacheKey);
    if (cachedWeather) return cachedWeather; // cache hit

    try {
      const result = await this.wrapped.handle(city);
      await this.cacheService.set<CurrentWeatherResponseDto>(weatherCacheKey, result, this.weatherTtl); // cache weather
      await this.cacheService.set<boolean>(cityCacheKey, true, this.cityTtl); // cache city existence
      return result;
    } catch (err) {
      if (err instanceof CityNotFoundException) {
        await this.cacheService.set<boolean>(cityCacheKey, false, this.cityTtl); // cache city inexistence
      }
      throw err;
    }
  }

  async cityExists(caceKey: string) {
    const exists = await this.cacheService.get<boolean>(caceKey);
    if (exists === false) throw new CityNotFoundException();
  }
}
