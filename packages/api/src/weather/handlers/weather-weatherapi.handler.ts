import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ProviderHandler } from '../../common/interfaces/weather-handler.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherFetch } from '../interfaces/weather-fetch.interface';
import { CurrentWeatherApiFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class CurrentWeatherApiHandler extends ProviderHandler<CurrentWeatherResponseDto> {
  private readonly apiKey: string;

  constructor(
    @Inject(WeatherFetch) private readonly weatherFetchService: WeatherFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('WEATHERAPI_API_KEY');
  }

  async fetch(city: string): Promise<CurrentWeatherResponseDto> {
    const apiUrl = `${Url.WEATHER_API}/current.json?key=${this.apiKey}&q=${city}`;

    const rawWeather = (await this.weatherFetchService.getCurrentWeatherRaw(apiUrl)) as CurrentWeatherApiFetchDto;
    if (rawWeather.location.name !== city) throw new CityNotFoundException();

    return this.parseRawWeather(rawWeather);
  }

  parseRawWeather(data: CurrentWeatherApiFetchDto): CurrentWeatherResponseDto {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }

  get providerName(): string {
    return 'WeatherAPI';
  }
}
