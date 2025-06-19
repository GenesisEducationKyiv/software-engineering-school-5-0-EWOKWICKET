import { WeatherUpdateInterface } from 'src/notifications/constants/weather-update.interface';
import { Templates } from './templates.enum';

export type TemplateParams =
  | {
      template: Templates.CONFIRMATION;
      params: {
        confirmUrl: string;
        unsubscribeUrl: string;
      };
    }
  | {
      template: Templates.WEATHER_UPDATE;
      params: WeatherUpdateInterface;
    };
