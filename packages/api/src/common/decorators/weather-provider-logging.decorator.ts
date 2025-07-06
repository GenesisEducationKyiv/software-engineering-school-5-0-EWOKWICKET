import { LoggerService } from 'src/logger/logger.service';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from 'src/weather/interfaces/chainable-weather-provider.abstract';

export class WeatherProviderLoggingDecorator extends ChainableWeatherProvider {
  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const result = await this.wrapped.handle(city);
    this.logger.logProvider('Current weather', this.wrapped.constructor.name, result);
    return result;
  }
}
