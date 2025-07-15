import { WeatherDto } from '@common/contracts/weather/dtos/weather.dto';

export type WeatherUpdate = {
  city: string;
  data: WeatherDto;
};
