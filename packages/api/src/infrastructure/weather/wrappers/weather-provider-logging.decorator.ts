import { ChainableWeatherProvider } from 'src/application/weather/interfaces/chainable-weather-provider.abstract';
import { ProviderLogger } from 'src/common/interfaces/logger.interface';
import { Weather } from 'src/domain/weather/weather.entity';

export class WeatherProviderLoggingDecorator extends ChainableWeatherProvider {
  constructor(
    private readonly wrapped: ChainableWeatherProvider,
    private readonly logger: ProviderLogger,
  ) {
    super();
  }

  async getCurrentWeather(city: string): Promise<Weather> {
    const result = await this.wrapped.handle(city);
    this.logger.logProvider('Current weather', this.wrapped.constructor.name, result);
    return result;
  }
}
