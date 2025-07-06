import { WeatherResponseDto } from 'src/application/weather/dtos/weather-response.dto';
import { ChainableWeatherProvider } from 'src/domain/weather/chainable-weather-provider.abstract';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

export class WeatherProviderLoggingDecorator extends ChainableWeatherProvider {
  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<WeatherResponseDto> {
    const result = await this.wrapped.handle(city);
    this.logger.logProvider('Current weather', this.wrapped.constructor.name, result);
    return result;
  }
}
