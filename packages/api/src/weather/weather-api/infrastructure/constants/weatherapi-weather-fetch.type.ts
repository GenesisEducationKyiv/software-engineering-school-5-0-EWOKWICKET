import { WeatherApiCityFetch } from 'src/weather/common/weather-provider/types/weatherapi-city-fetch.type';

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
