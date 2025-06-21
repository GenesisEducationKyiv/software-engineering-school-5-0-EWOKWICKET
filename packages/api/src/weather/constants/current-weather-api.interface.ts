import { CityResponseDto } from './city-response.dto';

export type CurrentWeatherApiFetchDto = {
  location: CityResponseDto;
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
};

export type CurrentOpenWeatherFetchDto = {
  weather: {
    description: string;
  };
  main: {
    temp: number;
    humidity: number;
  };
  name: string;
};

export type CurrentWeatherFetchDto = CurrentWeatherApiFetchDto | CurrentOpenWeatherFetchDto;
