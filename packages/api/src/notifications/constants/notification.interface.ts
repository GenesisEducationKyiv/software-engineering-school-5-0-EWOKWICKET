import { WeatherUpdateInterface } from './weather-update.interface';

export interface Notification {
  to: string;
  subject: string;
}

export interface ConfirmationNotification extends Notification {
  token: string;
}

export interface WeatherUpdateNotification extends Notification {
  data: WeatherUpdateInterface;
}
