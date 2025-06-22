import { CityWeatherApiFetchDto } from 'src/city/types/city-response.type';

export type CurrentWeatherApiFetchDto = {
  location: CityWeatherApiFetchDto;
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
};

export type CurrentOpenWeatherFetchDto = {
  weather: Array<{
    description: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  name: string;
};
