import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/common/enums/url.constants';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CurrentWeatherResponseDto } from '../dtos/current-weather-response.dto';
import { WeatherFetch } from '../interfaces/weather-fetch.interface';
import { WeatherHandler } from '../interfaces/weather-handler.interface';
import { CurrentWeatherApiFetchDto } from '../types/current-weather-api.type';

@Injectable()
export class WeatherApiHandler extends WeatherHandler {
  private readonly apiKey: string;

  constructor(
    @Inject(WeatherFetch) private readonly weatherFetchService: WeatherFetch,
    private readonly configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get('WEATHERAPI_API_KEY');
  }

  async handle(city: string): Promise<CurrentWeatherResponseDto> {
    const apiUrl = `${Url.WEATHER_API}/current.json?key=${this.apiKey}&q=${city}`;
    try {
      const rawWeather = (await this.weatherFetchService.getCurrentWeatherRaw(apiUrl)) as unknown as CurrentWeatherApiFetchDto;
      if (rawWeather.location.name !== city) throw new CityNotFoundException();

      console.log('WEATHERAPI');
      return this.parseRawWeather(rawWeather);
    } catch (err) {
      if (this.next && (err instanceof ExternalApiException || err instanceof CityNotFoundException)) {
        return this.next.handle(city);
      }
      throw err;
    }
  }

  parseRawWeather(data: CurrentWeatherApiFetchDto): CurrentWeatherResponseDto {
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
