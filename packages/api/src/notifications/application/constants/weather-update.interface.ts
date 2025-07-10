import { Weather } from 'src/weather/domain/weather.entity';

export type WeatherUpdate = {
  city: string;
} & Weather;
