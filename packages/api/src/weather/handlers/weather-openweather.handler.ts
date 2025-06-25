import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ProviderHandler } from '../../common/abstractions/weather-handler.abstract';
import { WeatherFetch } from '../abstractions/weather-fetch.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { CurrentOpenWeatherFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class CurrentOpenWeatherHandler extends ProviderHandler<CurrentWeatherResponseDto> {
  private readonly apiKey: string;

  constructor(
    @Inject(WeatherFetch) private readonly weatherFetchService: WeatherFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('OPENWEATHER_API_KEY');
  }

  async process(city: string): Promise<CurrentWeatherResponseDto> {
    const apiUrl = `${Url.OPENWEATHER_API}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const rawWeather = (await this.weatherFetchService.getCurrentWeatherRaw(apiUrl)) as CurrentOpenWeatherFetchDto;
    this._validateRawWeather(rawWeather, city);
    return this._parseRawWeather(rawWeather);
  }

  _validateRawWeather(data: CurrentOpenWeatherFetchDto, city: string): void {
    if (data.name !== city) throw new CityNotFoundException(); //new validation logic could be added
  }

  _parseRawWeather(data: CurrentOpenWeatherFetchDto): CurrentWeatherResponseDto {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }

  get providerName(): string {
    return 'OpenWeather';
  }
}
