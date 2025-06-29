import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderHandler } from 'src/common/abstractions/weather-handler.abstract';
import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';
import { CityFetch } from '../abstractions/city-fetch.abstract';

@Injectable()
export class CityOpenWeatherHandler extends ProviderHandler<boolean> {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.openWeatherApiKey');
    this.apiUrl = this.configService.get('app.urls.openWeatherApi');
  }

  async process(city: string): Promise<boolean> {
    const apiUrl = `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const data = (await this.cityFetchService.searchCitiesRaw(apiUrl)) as unknown as CurrentOpenWeatherFetchDto;
    return this.validateCity(data, city);
  }

  private validateCity(data: CurrentOpenWeatherFetchDto, city: string): boolean {
    return data.name === city;
  }

  get providerName(): string {
    return 'OpenWeather';
  }
}
