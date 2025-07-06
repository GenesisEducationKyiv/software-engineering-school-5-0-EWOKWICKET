import { CacheAccessor } from 'src/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/utils/key-transformation';
import { CityCachePrefixes } from 'src/city/infrastructure/cache/city-cache-prefixes.enum';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { HOUR, MINUTE } from 'src/common/utils/time-units';
import { WeatherCachePrefixes } from 'src/weather/infrastructure/cache/weather-cache-prefixes.enum';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from 'src/weather/interfaces/chainable-weather-provider.abstract';

export class WeatherProviderCacheProxy extends ChainableWeatherProvider {
  private readonly weatherTtl: number = MINUTE * 10;
  private readonly cityTtl: number = HOUR;

  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly cacheService: CacheAccessor,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const cityCacheKey = transformKey(CityCachePrefixes.CITY_VALIDATION, city); // city cache key
    await this.cityExists(cityCacheKey);

    const weatherCacheKey = transformKey(WeatherCachePrefixes.CURRENT_WEATHER, city); // weather cache key
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
