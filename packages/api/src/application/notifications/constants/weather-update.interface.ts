import { Weather } from 'src/domain/weather/weather.entity';

export type WeatherUpdate = {
  city: string;
} & Weather;
