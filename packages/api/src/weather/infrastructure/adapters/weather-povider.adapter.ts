import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from 'src/weather/interfaces/chainable-weather-provider.abstract';
import { WeatherProvider } from 'src/weather/interfaces/current-weather.abstract';

export class WeatherProviderAdapter implements WeatherProvider {
  constructor(private readonly weatherChain: ChainableWeatherProvider) {}

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    return await this.weatherChain.handle(city);
  }
}
