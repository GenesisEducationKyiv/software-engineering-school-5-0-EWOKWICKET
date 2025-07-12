import { Weather } from 'src/weather/weather/domain/weather.entity';

export type WeatherUpdate = {
  city: string;
} & Weather;
