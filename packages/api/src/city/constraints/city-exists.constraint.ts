import { Inject, Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CacheServiceInterface } from 'src/cache/abstractions/cache-service.interface';
import { ProviderHandler } from 'src/common/abstractions/weather-handler.abstract';
import { ProviderLoggingDecorator } from 'src/common/decorators/provider-logging.decorator';
import { MINUTE } from 'src/common/utils/time-units';
import { LoggerService } from 'src/logger/logger.service';
import { CityOpenWeatherHandler } from '../handlers/city-openweather.handler';
import { CityWeatherApiHandler } from '../handlers/city-weatherapi.handler';

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExistsConstraint implements ValidatorConstraintInterface {
  private chain: ProviderHandler<void>;
  private readonly loggerMessage: string = 'City validation';

  constructor(
    private readonly logger: LoggerService,
    private readonly weatherApiHandler: CityWeatherApiHandler,
    private readonly openweatherHandler: CityOpenWeatherHandler,
    @Inject(CacheServiceInterface)
    private readonly cacheService: CacheServiceInterface,
  ) {
    const decoratedWeatherAPI = new ProviderLoggingDecorator(weatherApiHandler, logger, this.loggerMessage);
    const decoratedOpenWeather = new ProviderLoggingDecorator(openweatherHandler, logger, this.loggerMessage);

    this.chain = decoratedWeatherAPI.setNext(decoratedOpenWeather);
  }

  async validate(value: string) {
    const cacheKey = `cityValidation:${value.toLowerCase()}`;

    const cached = await this.cacheService.get<boolean>(cacheKey);
    if (cached) {
      return true;
    }

    const result = await this.handle(value);
    await this.cacheService.set(cacheKey, result, 10 * MINUTE);

    return result;
  }

  private async handle(city: string) {
    try {
      await this.chain.handle(city);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'City Not Found';
  }
}
