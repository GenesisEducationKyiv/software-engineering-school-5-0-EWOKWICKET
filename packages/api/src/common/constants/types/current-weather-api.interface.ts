import { City } from './city.interface';

export class CurrentWeatherAPI {
  location: City;
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
}
