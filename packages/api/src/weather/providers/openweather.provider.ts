import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { ChainableWeatherProvider } from '../interfaces/chainable-weather-provider.abstract';
import { CurrentOpenWeatherFetchDto } from '../types/current-weather-api.type';

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

  async getCurrentWeather(city: string): Promise<CurrentWeatherResponseDto> {
    const data = await this.getRawWeather(city);
    return this.parseRawWeather(data);
  }

  private async getRawWeather(city: string): Promise<CurrentOpenWeatherFetchDto> {
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

  private parseRawWeather(data: CurrentOpenWeatherFetchDto): CurrentWeatherResponseDto {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }
}
