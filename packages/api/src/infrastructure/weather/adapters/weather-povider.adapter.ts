import { WeatherResponseDto } from 'src/application/weather/dtos/weather-response.dto';
import { ChainableWeatherProvider } from 'src/domain/weather/chainable-weather-provider.abstract';
import { WeatherProvider } from 'src/domain/weather/weather-provider.abstract';

export class WeatherProviderAdapter implements WeatherProvider {
  constructor(private readonly weatherChain: ChainableWeatherProvider) {}

  async getCurrentWeather(city: string): Promise<WeatherResponseDto> {
    return await this.weatherChain.handle(city);
  }
}
