import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { ChainableWeatherProvider } from 'src/domain/weather/interfaces/chainable-weather-provider.abstract';
import { Weather } from 'src/domain/weather/weather.entity';
import { WeatherApiWeatherFetch } from 'src/infrastructure/shared/constants/weatherapi-weather-fetch.type';
import { WeatherApiDtoMapper } from '../mappers/weatherapi.mapper';

@Injectable()
export class WeatherApiWeatherProvider extends ChainableWeatherProvider {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
    this.apiKey = this.configService.get('app.weatherApiKey');
    this.apiUrl = this.configService.get('app.urls.weatherApi');
  }

  async getCurrentWeather(city: string): Promise<Weather> {
    const data = await this.getRawWeather(city);
    this.validate(data, city);
    return WeatherApiDtoMapper.toEntity(data);
  }

  private async getRawWeather(city: string): Promise<WeatherApiWeatherFetch> {
    const response = await firstValueFrom(
      this.httpService.request<WeatherApiWeatherFetch>({
        method: 'GET',
        baseURL: this.apiUrl,
        url: '/current.json',
        params: {
          key: this.apiKey,
          q: city,
        },
      }),
    ).catch((err: AxiosError) => {
      if (err.response.status === HttpStatus.BAD_REQUEST) throw new CityNotFoundException();
      throw new ExternalApiException();
    });

    return response.data;
  }

  private validate(data: WeatherApiWeatherFetch, city: string) {
    if (data.location.name !== city) throw new CityNotFoundException();
  }
}
