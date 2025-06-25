import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderHandler } from 'src/common/abstractions/weather-handler.abstract';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { CityFetch } from '../abstractions/city-fetch.abstract';
import { CityWeatherApiFetchDto } from '../types/city-response.type';

@Injectable()
export class CityWeatherApiHandler extends ProviderHandler<void> {
  private readonly apiKey: string;

  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('WEATHERAPI_API_KEY');
  }

  async process(city: string): Promise<void> {
    const apiUrl = `${Url.WEATHER_API}/search.json?key=${this.apiKey}&q=${city}`;
    const data = (await this.cityFetchService.searchCitiesRaw(apiUrl)) as unknown as CityWeatherApiFetchDto[];
    this._validateCity(data, city);
  }

  private _validateCity(data: CityWeatherApiFetchDto[], city: string): void {
    const valid = data.length > 0 && data[0].name === city;

    if (!valid) {
      throw new CityNotFoundException();
    }
  }

  get providerName(): string {
    return 'WeatherAPI';
  }
}
