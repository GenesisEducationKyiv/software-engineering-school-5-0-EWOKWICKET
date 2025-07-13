import { Weather } from 'src/weather/weather-api/domain/weather.entity';

export type WeatherUpdate = {
  city: string;
} & Weather;
