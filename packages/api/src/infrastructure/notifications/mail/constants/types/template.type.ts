import { WeatherUpdate } from 'src/infrastructure/notifications/types/weather-update.interface';
import { Templates } from '../enums/templates.enum';

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
      params: WeatherUpdate;
    };
