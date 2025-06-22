import { CurrentOpenWeatherFetchDto } from 'src/weather/types/current-weather-api.type';

export type CityWeatherApiFetchDto = {
  name: string;
  region: string;
  country: string;
};

export type CityResponseDto = CityWeatherApiFetchDto[] | CurrentOpenWeatherFetchDto;
