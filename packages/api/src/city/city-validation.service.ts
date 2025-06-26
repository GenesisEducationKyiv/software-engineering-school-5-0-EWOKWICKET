import { Inject, Injectable } from '@nestjs/common';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { CityFetch } from './interfaces/city-fetch.interface';

@Injectable()
export class CityValidationService {
  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
  ) {}

  async validate(city: string): Promise<void> {
    const data = await this.cityFetchService.searchCitiesRaw(city);
    const valid = data.length > 0 && data[0].name === city;

    if (!valid) {
      throw new CityNotFoundException();
    }
  }
}
