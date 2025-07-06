import { LoggerService } from 'src/logger/logger.service';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from 'src/weather/interfaces/chainable-weather-provider.abstract';
import { Loggable } from '../interfaces/loggable.interace';

export class WeatherProviderLoggingDecorator extends ChainableWeatherProvider {
  private readonly message: string = 'CurrentWeather';

  constructor(
    private readonly wrapped: ChainableWeatherProvider & Loggable,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const result = await this.wrapped.handle(city);
    this.logger.logProviderAction(this.message, this.wrapped.executor, result);
    return result;
  }
}
