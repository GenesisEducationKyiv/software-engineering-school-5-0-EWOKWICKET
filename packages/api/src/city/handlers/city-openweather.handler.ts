import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ProviderHandler } from 'src/common/interfaces/weather-handler.interface';
import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';
import { CityFetch } from '../interfaces/city-fetch.interface';

@Injectable()
export class OpenWeatherHandler extends ProviderHandler<void> {
  private readonly apiKey: string;

  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('OPENWEATHER_API_KEY');
  }

  async fetch(city: string): Promise<void> {
    const apiUrl = `${Url.OPENWEATHER_API}/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const data = (await this.cityFetchService.searchCitiesRaw(apiUrl)) as unknown as CurrentOpenWeatherFetchDto;
    const valid = data.name === city;

    if (!valid) {
      throw new CityNotFoundException();
    }
  }

  get providerName(): string {
    return 'OpenWeather';
  }
}
