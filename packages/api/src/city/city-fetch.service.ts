import { Injectable } from '@nestjs/common';
import { CityResponseDto } from 'src/city/types/city-response.type';
import { ExternalApiException } from 'src/common/errors/external-api.error';
import { CityFetch } from './abstractions/city-fetch.abstract';

@Injectable()
export class CityFetchService implements CityFetch {
  async searchCitiesRaw(url: string): Promise<CityResponseDto> {
    const response = await fetch(url);
    if (response.status !== 200) throw new ExternalApiException();

    return await response.json();
  }
}
