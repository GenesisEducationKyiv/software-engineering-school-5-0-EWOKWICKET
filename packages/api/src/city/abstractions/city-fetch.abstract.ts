import { CityFetchDto } from 'src/city/types/city-response.type';

export abstract class CityFetch {
  abstract searchCitiesRaw(url: string): Promise<CityFetchDto>;
}
