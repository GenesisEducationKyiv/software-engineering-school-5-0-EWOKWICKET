import { Inject, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { ProviderHandler } from 'src/common/abstractions/weather-handler.abstract';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { CityValidationCacheProxy } from 'src/common/proxies/city-validation-cache.proxy';
import { LoggerService } from 'src/logger/logger.service';
import { CityOpenWeatherHandler } from '../handlers/city-openweather.handler';
import { CityWeatherApiHandler } from '../handlers/city-weatherapi.handler';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  private chain: ProviderHandler<boolean>;
  private readonly loggerMessage: string = 'City validation';

  constructor(
    private readonly logger: LoggerService,
    private readonly weatherApiHandler: CityWeatherApiHandler,
    private readonly openweatherHandler: CityOpenWeatherHandler,
    @Inject(CacheServiceInterface)
    private readonly cacheService: CacheServiceInterface,
  ) {
    const decoratedWeatherAPI = new ProviderLoggingDecorator(weatherApiHandler, logger, this.loggerMessage);
    const proxiedWeatherAPI = new CityValidationCacheProxy(decoratedWeatherAPI, cacheService);

    const decoratedOpenWeather = new ProviderLoggingDecorator(openweatherHandler, logger, this.loggerMessage);
    const proxiedOpenWeather = new CityValidationCacheProxy(decoratedOpenWeather, cacheService);

    this.chain = proxiedWeatherAPI.setNext(proxiedOpenWeather);
  }

  async validate(value: string) {
    return await this.chain.handle(value);
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
