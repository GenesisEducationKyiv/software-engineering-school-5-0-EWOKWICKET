import { Inject, Injectable } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { WeatherCacheProxy } from 'src/common/proxies/weather-cache.proxy';
import { LoggerService } from 'src/logger/logger.service';
import { ProviderHandler } from '../../common/abstractions/weather-handler.abstract';
import { WeatherServiceInterface } from '../abstractions/current-weather.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { CurrentOpenWeatherHandler } from '../handlers/weather-openweather.handler';
import { CurrentWeatherApiHandler } from '../handlers/weather-weatherapi.handler';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  private readonly chain: ProviderHandler<CurrentWeatherResponseDto>;
  private readonly loggerMessage: string = 'Current weather';

  constructor(
    private readonly logger: LoggerService,
    private readonly weatherApiHandler: CurrentWeatherApiHandler,
    private readonly openWeatherHandler: CurrentOpenWeatherHandler,
    @Inject(CacheServiceInterface)
    private readonly cacheService: CacheServiceInterface,
  ) {
    const decoratedWeatherAPI = new ProviderLoggingDecorator(weatherApiHandler, logger, this.loggerMessage);
    const proxiedWeatherAPI = new WeatherCacheProxy(decoratedWeatherAPI, cacheService);

    const decoratedOpenWeather = new ProviderLoggingDecorator(openWeatherHandler, logger, this.loggerMessage);
    const proxiedOpenWeather = new WeatherCacheProxy(decoratedOpenWeather, cacheService);

    this.chain = proxiedWeatherAPI.setNext(proxiedOpenWeather);
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return await this.chain.handle(city);
  }
}
