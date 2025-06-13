import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class WeatherApiService {
  private api_key;

  constructor() {
    this.api_key = process.env.WEATHER_API_KEY;
  }

  async searchCitiesRaw(city: string): Promise<Record<string, string | number>[]> {
    const searchUrl = `http://api.weatherapi.com/v1/search.json?key=${this.api_key}&q=${city}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    return data;
  }

  async getCurrentWeatherRaw(city: string) {
    const currentWeatherUrl = `http://api.weatherapi.com/v1/current.json?key=${this.api_key}&q=${city}`;

    const response: Response = await fetch(currentWeatherUrl);
    if (response.status !== 200) throw new BadRequestException('No matching location found.');

    const data = await response.json();
    if (data.location.name !== city) throw new BadRequestException('No matching location found.');

    return data;
  }
}
