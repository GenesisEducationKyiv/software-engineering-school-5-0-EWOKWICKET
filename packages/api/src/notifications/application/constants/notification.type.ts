import { WeatherUpdate } from './weather-update.type';

export type Notification = {
  to: string;
  subject: string;
};

export type ConfirmationNotification = Notification & {
  token: string;
};

export type WeatherUpdateNotification = Notification & {
  data: WeatherUpdate;
};
