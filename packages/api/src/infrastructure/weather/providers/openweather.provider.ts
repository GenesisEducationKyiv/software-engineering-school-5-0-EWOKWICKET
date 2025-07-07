import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { ChainableWeatherProvider } from 'src/domain/weather/interfaces/chainable-weather-provider.abstract';
import { Weather } from 'src/domain/weather/weather.entity';
import { OpenWeatherWeatherFetch } from 'src/infrastructure/shared/types/openweather-weather-fetch.type';
import { OpenWeatherDtoMapper } from '../mappers/openweather.mapper';

@Injectable()
export class OpenWeatherWeatherProvider extends ChainableWeatherProvider {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
    this.apiKey = this.configService.get('app.openWeatherApiKey');
    this.apiUrl = this.configService.get('app.urls.openWeatherApi');
  }

  async getCurrentWeather(city: string): Promise<Weather> {
    const data = await this.getRawWeather(city);
    return OpenWeatherDtoMapper.toEntity(data);
  }

  private async getRawWeather(city: string): Promise<OpenWeatherWeatherFetch> {
    const response = await firstValueFrom(
      this.httpService.request<OpenWeatherWeatherFetch>({
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
}
