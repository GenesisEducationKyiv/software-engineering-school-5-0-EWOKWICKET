import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { Handler } from '../../common/interfaces/handler.interface';
import { CurrentOpenWeatherFetchDto } from '../constants/current-weather-api.interface';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherFetch } from '../interfaces/weather-fetch.interface';

@Injectable()
export class OpenWeatherHandler extends Handler {
  private readonly apiKey: string;

  constructor(
    @Inject(WeatherFetch) private readonly weatherFetchService: WeatherFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('OPENWEATHER_API_KEY');
  }

  async handle(city: string): Promise<CurrentWeatherResponseDto> {
    const apiUrl = `${Url.OPENWEATHER}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    try {
      const rawWeather = (await this.weatherFetchService.getCurrentWeatherRaw(apiUrl)) as unknown as CurrentOpenWeatherFetchDto;
      if (rawWeather.name !== city) throw new CityNotFoundException();

      console.log('OPENWEATHER');
      return this.parseRawWeather(rawWeather);
    } catch (err) {
      if (this.next && err instanceof ExternalApiException) {
        return this.next.handle(city);
      }
      throw err;
    }
  }

  parseRawWeather(data: CurrentOpenWeatherFetchDto): CurrentWeatherResponseDto {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };
  }
}
