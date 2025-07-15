import { WeatherUpdate } from '@common/contracts/notifications/constants/weather-update.type';

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
