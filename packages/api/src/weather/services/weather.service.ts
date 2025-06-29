import { Inject, Injectable } from '@nestjs/common';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { MINUTE } from 'src/common/utils/time-units';
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
    const decoratedOpenWeather = new ProviderLoggingDecorator(openWeatherHandler, logger, this.loggerMessage);

    this.chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const cacheKey = `currentWeather:${city.toLowerCase()}`;

    const cached = await this.cacheService.get<CurrentWeatherResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.chain.handle(city);
    await this.cacheService.set(cacheKey, result, 10 * MINUTE);

    return result;
  }
}
