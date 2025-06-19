import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Url } from 'src/common/constants/enums/url.constants';
import { CityResponseDto } from 'src/weather/constants/city-response.dto';

@Injectable()
export class CityService {
  private readonly apiUrl = Url.OUTER_WEATHER_API;
  private readonly apiKey = process.env.WEATHER_API_KEY;

  async searchCities(city: string): Promise<CityResponseDto[]> {
    const searchUrl = `${this.apiUrl}/search.json?key=${this.apiKey}&q=${city}`;
    const response = await fetch(searchUrl);

    if (response.status !== 200) throw new InternalServerErrorException();

    return await response.json();
  }
}
