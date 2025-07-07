import { WeatherApiCityFetch } from 'src/infrastructure/shared/constants/weatherapi-city-fetch.type';

export type WeatherApiWeatherFetch = {
  location: WeatherApiCityFetch;
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
};
