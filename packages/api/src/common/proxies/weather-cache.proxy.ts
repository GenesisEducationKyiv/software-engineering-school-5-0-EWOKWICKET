import { Inject } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ProviderHandler } from '../abstractions/weather-handler.abstract';
import { MINUTE } from '../utils/time-units';

export class WeatherCacheProxy extends ProviderHandler<CurrentWeatherResponseDto> {
  private readonly keyBase: string = 'currentWeather:';
  private readonly ttl: number = 10 * MINUTE;

  constructor(
    @Inject(CacheServiceInterface)
    private readonly wrapped: ProviderHandler<CurrentWeatherResponseDto>,
    private readonly cacheService: CacheServiceInterface,
  ) {
    super();
  }

  async process(city: string): Promise<CurrentWeatherResponseDto> {
    const cacheKey = `${this.keyBase}${city.toLowerCase()}`;
    const cached = await this.cacheService.get<CurrentWeatherResponseDto>(cacheKey);
    if (cached) return cached;

    const result = await this.wrapped.handle(city);
    await this.cacheService.set<CurrentWeatherResponseDto>(cacheKey, result, this.ttl);

    return result;
  }

  get providerName(): string {
    return this.wrapped.providerName;
  }

  setNext(handler: ProviderHandler<CurrentWeatherResponseDto>) {
    this.wrapped.setNext(handler);
    this.next = handler;
    return this;
  }
}
