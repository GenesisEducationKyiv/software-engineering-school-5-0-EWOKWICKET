import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { Loggable } from 'src/common/interfaces/loggable.interace';
import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';
import { ChainableCityProvider } from '../interfaces/chainable-city.provider';

@Injectable()
export class OpenWeatherCityProvider extends ChainableCityProvider implements Loggable {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  readonly executor = 'OpenWeather';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('app.openWeatherApiKey');
    this.apiUrl = this.configService.get('app.urls.openWeatherApi');
  }

  async validateCity(city: string): Promise<boolean> {
    const data = await this.getCity(city);
    return this.isValid(data, city);
  }

  private async getCity(city: string): Promise<CurrentOpenWeatherFetchDto> {
    const response = await firstValueFrom(
      this.httpService.request<CurrentOpenWeatherFetchDto>({
        method: 'GET',
        baseURL: this.apiUrl,
        url: '/weather',
        params: {
          appid: this.apiKey,
          q: city,
          units: 'metric',
        },
      }),
    ).catch((err: AxiosError) => {
      if (err.response.status === HttpStatus.NOT_FOUND) throw new CityNotFoundException();
      throw new ExternalApiException();
    });

    return response.data;
  }

  private isValid(data: CurrentOpenWeatherFetchDto, city: string): boolean {
    const valid = data.name === city;

    if (!valid) return false;
    return true;
  }
}
