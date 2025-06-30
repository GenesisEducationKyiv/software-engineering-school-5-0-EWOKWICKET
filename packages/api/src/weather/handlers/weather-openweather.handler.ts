import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { Chainable } from '../../common/interfaces/weather-handler.abstract';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherFetch } from '../interfaces/weather-fetch.abstract';
import { CurrentOpenWeatherFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class CurrentOpenWeatherHandler extends Chainable<CurrentWeatherResponseDto> {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    @Inject(WeatherFetch) private readonly weatherFetchService: WeatherFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.openWeatherApiKey');
    this.apiUrl = this.configService.get('app.urls.openWeatherApi');
  }

  async process(city: string): Promise<CurrentWeatherResponseDto> {
    const apiUrl = this.buildUrl(city);
    const rawWeather = (await this.weatherFetchService.getCurrentWeatherRaw(apiUrl)) as CurrentOpenWeatherFetchDto;
    this.validateRawWeather(rawWeather, city);
    return this.parseRawWeather(rawWeather);
  }

  buildUrl(city: string) {
    return `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
  }

  validateRawWeather(data: CurrentOpenWeatherFetchDto, city: string): void {
    if (data.name !== city) throw new CityNotFoundException(); //new validation logic could be added
  }

  parseRawWeather(data: CurrentOpenWeatherFetchDto): CurrentWeatherResponseDto {
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
