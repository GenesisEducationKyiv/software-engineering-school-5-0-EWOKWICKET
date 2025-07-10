import { WeatherApiCityFetch } from 'src/weather/application/constants/weatherapi-city-fetch.type';

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
