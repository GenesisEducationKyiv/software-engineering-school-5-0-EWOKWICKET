import { ChainableWeatherProvider } from 'src/domain/weather/interfaces/chainable-weather-provider.abstract';
import { Weather } from 'src/domain/weather/weather.entity';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

export class WeatherProviderLoggingDecorator extends ChainableWeatherProvider {
  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<Weather> {
    const result = await this.wrapped.handle(city);
    this.logger.logProvider('Current weather', this.wrapped.constructor.name, result);
    return result;
  }
}
