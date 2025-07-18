import { WeatherDto } from '@common/contracts/weather/dtos/weather.dto';

export type WeatherUpdateDto = WeatherDto & {
  city: string;
};
