import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ProviderHandler } from '../../common/abstractions/weather-handler.abstract';
import { WeatherFetch } from '../abstractions/weather-fetch.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { CurrentWeatherApiFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class CurrentWeatherApiHandler extends ProviderHandler<CurrentWeatherResponseDto> {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    @Inject(WeatherFetch) private readonly weatherFetchService: WeatherFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.weatherApiKey');
    this.apiUrl = this.configService.get('app.urls.weatherApi');
  }

  async process(city: string): Promise<CurrentWeatherResponseDto> {
    const apiUrl = `${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`;
    const rawWeather = (await this.weatherFetchService.getCurrentWeatherRaw(apiUrl)) as CurrentWeatherApiFetchDto;
    this._validateRawWeather(rawWeather, city);
    return this._parseRawWeather(rawWeather);
  }

  private _validateRawWeather(data: CurrentWeatherApiFetchDto, city: string): void {
    if (data.location.name !== city) throw new CityNotFoundException(); //new validation logic could be added
  }

  private _parseRawWeather(data: CurrentWeatherApiFetchDto): CurrentWeatherResponseDto {
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
