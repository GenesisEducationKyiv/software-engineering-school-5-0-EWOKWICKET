import { CacheAccessor } from '@cache/application/interfaces/cache-service.interface';
import { createCacheKey } from '@cache/application/utils/create-cache-key';
import { HOUR, MINUTE } from '@common/utils/time-units';
import { CityCachePrefixes } from 'src/city/infrastructure/constants/city-cache-prefixes.enum';
import { CityNotFoundError } from 'src/common/errors/city-not-found.error';
import { ChainableWeatherProvider } from '../../application/interfaces/chainable-weather-provider.abstract';
import { Weather } from '../../domain/weather.entity';
import { WeatherCachePrefixes } from '../constants/weather-cache-prefixes.enum';

export class WeatherProviderCacheProxy extends ChainableWeatherProvider {
  private readonly weatherTtl: number = MINUTE * 10;
  private readonly cityTtl: number = HOUR;

  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly cacheService: CacheAccessor,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<Weather> {
    const cityCacheKey = createCacheKey(CityCachePrefixes.CITY_VALIDATION, city); // city cache key
    await this.cityExists(cityCacheKey);

    const weatherCacheKey = createCacheKey(WeatherCachePrefixes.CURRENT_WEATHER, city); // weather cache key
    const cachedWeather = await this.cacheService.get<Weather>(weatherCacheKey);
    if (cachedWeather) return cachedWeather; // cache hit

    try {
      const result = await this.wrapped.handle(city);
      await this.cacheService.set<Weather>(weatherCacheKey, result, this.weatherTtl); // cache weather
      await this.cacheService.set<boolean>(cityCacheKey, true, this.cityTtl); // cache city existence
      return result;
    } catch (err) {
      if (err instanceof CityNotFoundError) {
        await this.cacheService.set<boolean>(cityCacheKey, false, this.cityTtl); // cache city inexistence
      }
      throw err;
    }
  }

  private async cityExists(caceKey: string) {
    const exists = await this.cacheService.get<boolean>(caceKey);
    if (exists === false) throw new CityNotFoundError();
  }
}
