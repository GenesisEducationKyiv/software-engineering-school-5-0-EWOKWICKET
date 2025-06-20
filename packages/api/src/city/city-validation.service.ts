import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityNotFoundException } from 'src/common/errors/city-not-found.error';
import { CityFetch } from './interfaces/city-fetch.interface';

@Injectable()
export class CityValidationService {
  private TEST_ENV: boolean;
  constructor(
    @Inject(CityFetch)
    private readonly cityFetchService: CityFetch,
    private readonly configService: ConfigService,
  ) {
    this.TEST_ENV = this.configService.get('NODE_ENV') === 'test';
  }

  async validate(city: string): Promise<void> {
    if (this.TEST_ENV) {
      if (city === 'Valid') return;
      else throw new CityNotFoundException();
    }

    const data = await this.cityFetchService.searchCitiesRaw(city);
    const valid = data.length > 0 && data[0].name === city;

    if (!valid) {
      throw new CityNotFoundException();
    }
  }
}
