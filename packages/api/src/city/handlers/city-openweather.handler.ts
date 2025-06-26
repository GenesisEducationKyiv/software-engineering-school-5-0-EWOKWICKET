import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderHandler } from 'src/common/abstractions/weather-handler.abstract';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';
import { CityFetch } from '../abstractions/city-fetch.abstract';

@Injectable()
export class CityOpenWeatherHandler extends ProviderHandler<void> {
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

  async process(city: string): Promise<void> {
    const apiUrl = `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const data = (await this.cityFetchService.searchCitiesRaw(apiUrl)) as unknown as CurrentOpenWeatherFetchDto;
    this._validateCity(data, city);
  }

  private _validateCity(data: CurrentOpenWeatherFetchDto, city: string): void {
    const valid = data.name === city;

    if (!valid) {
      throw new CityNotFoundException();
    }
  }

  get providerName(): string {
    return 'OpenWeather';
  }
}
