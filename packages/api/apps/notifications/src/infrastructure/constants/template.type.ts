import { WeatherUpdateDto } from '@proto/notifications';
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
      params: WeatherUpdateDto;
    };
