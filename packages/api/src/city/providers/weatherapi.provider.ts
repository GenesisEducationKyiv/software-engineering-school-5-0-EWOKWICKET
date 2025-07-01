import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { Loggable } from 'src/common/interfaces/loggable.interace';
import { ChainableCityValidation } from '../interfaces/chainable-city-validation.provider';
import { CityWeatherApiFetchDto } from '../types/city-fetch.type';

@Injectable()
export class WeatherApiCityValidation extends ChainableCityValidation implements Loggable {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  readonly executor = 'WeatherAPI';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.weatherApiKey');
    this.apiUrl = this.configService.get('app.urls.weatherApi');
  }

  async validateCity(city: string): Promise<boolean> {
    const data = await this.getRawWeather(city);
    return this.isValid(data, city);
  }

  private async getRawWeather(city: string): Promise<CityWeatherApiFetchDto[]> {
    const response = await firstValueFrom(
      this.httpService.request<CityWeatherApiFetchDto[]>({
        method: 'GET',
        baseURL: this.apiUrl,
        url: '/current.json',
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

  private isValid(data: CityWeatherApiFetchDto[], city: string): boolean {
    return data.length && data[0].name === city;
  }
}
