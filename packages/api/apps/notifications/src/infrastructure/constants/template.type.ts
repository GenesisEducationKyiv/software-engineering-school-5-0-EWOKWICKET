import { WeatherUpdateDto } from '@common/contracts/notifications/constants/weather-update.type';
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
