import { WeatherResponseDto } from 'src/application/weather/dtos/weather-response.dto';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { HOUR, MINUTE } from 'src/common/utils/time-units';
import { ChainableWeatherProvider } from 'src/domain/weather/chainable-weather-provider.abstract';
import { CacheAccessor } from 'src/infrastructure/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/infrastructure/cache/utils/key-transformation';
import { CachePrefixes } from 'src/infrastructure/shared/constants/cache-prefixes.enum';

export class WeatherProviderCacheProxy extends ChainableWeatherProvider {
  private readonly weatherTtl: number = MINUTE * 10;
  private readonly cityTtl: number = HOUR;

  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly cacheService: CacheAccessor,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<WeatherResponseDto> {
    const cityCacheKey = transformKey(CachePrefixes.CITY_VALIDATION, city); // city cache key
    await this.cityExists(cityCacheKey);

    const weatherCacheKey = transformKey(CachePrefixes.CURRENT_WEATHER, city); // weather cache key
    const cachedWeather = await this.cacheService.get<WeatherResponseDto>(weatherCacheKey);
    if (cachedWeather) return cachedWeather; // cache hit

    try {
      const result = await this.wrapped.handle(city);
      await this.cacheService.set<WeatherResponseDto>(weatherCacheKey, result, this.weatherTtl); // cache weather
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
