import { Injectable } from '@nestjs/common';
import { Url } from 'src/common/enums/url.constants';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CityResponseDto } from 'src/weather/constants/city-response.dto';

@Injectable()
export class CityService {
  private readonly apiUrl = Url.OUTER_WEATHER_API;
  private readonly apiKey = process.env.WEATHER_API_KEY;

  async searchCities(city: string): Promise<CityResponseDto[]> {
    const searchUrl = `${this.apiUrl}/search.json?key=${this.apiKey}&q=${city}`;
    const response = await fetch(searchUrl);

    if (response.status !== 200) throw new ExternalApiException();

    return await response.json();
  }
}
