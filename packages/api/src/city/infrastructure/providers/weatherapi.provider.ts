import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { WeatherApiCityFetch } from 'src/weather/application/constants/weatherapi-city-fetch.type';
import { ChainableCityProvider } from '../../application/interfaces/chainable-city.provider';

@Injectable()
export class WeatherApiCityProvider extends ChainableCityProvider {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.weatherApiKey');
    this.apiUrl = this.configService.get('app.urls.weatherApi');
  }

  async validateCity(city: string): Promise<boolean> {
    const data = await this.getCity(city);
    return this.isValid(data, city);
  }

  private async getCity(city: string): Promise<WeatherApiCityFetch[]> {
    const response = await firstValueFrom(
      this.httpService.request<WeatherApiCityFetch[]>({
        method: 'GET',
        baseURL: this.apiUrl,
        url: '/search.json',
        params: {
          key: this.apiKey,
          q: city,
        },
      }),
    ).catch((err: AxiosError) => {
      if (err.response.status === HttpStatus.NOT_FOUND) throw new CityNotFoundException();
      throw new ExternalApiException();
    });

    return response.data;
  }

  private isValid(data: WeatherApiCityFetch[], city: string): boolean {
    return data.length && data[0].name === city;
  }
}
