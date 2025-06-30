import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { Chainable } from '../../common/interfaces/weather-handler.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherFetch } from '../interfaces/weather-fetch.abstract';
import { CurrentWeatherApiFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class CurrentWeatherApiHandler extends Chainable<CurrentWeatherResponseDto> {
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
    const apiUrl = this.buildUrl(city);
    const rawWeather = (await this.weatherFetchService.getCurrentWeatherRaw(apiUrl)) as CurrentWeatherApiFetchDto;
    this.validateRawWeather(rawWeather, city);
    return this.parseRawWeather(rawWeather);
  }

  buildUrl(city: string) {
    return `${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`;
  }

  private validateRawWeather(data: CurrentWeatherApiFetchDto, city: string): void {
    if (data.location.name !== city) throw new CityNotFoundException(); //new validation logic could be added
  }

  private parseRawWeather(data: CurrentWeatherApiFetchDto): CurrentWeatherResponseDto {
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
