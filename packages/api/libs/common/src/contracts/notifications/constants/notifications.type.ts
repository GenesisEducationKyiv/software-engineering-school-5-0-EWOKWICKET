import { NotificationSubjects } from './notification-subjects.enum';
import { WeatherUpdateDto } from './weather-update.type';

export type Notification = {
  to: string;
  subject: NotificationSubjects;
};

export type ConfirmationNotification = Notification & {
  token: string;
};

export type WeatherUpdateNotification = Notification & {
  data: WeatherUpdateDto;
};
