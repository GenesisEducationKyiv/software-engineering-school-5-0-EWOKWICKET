import { NotificationsFrequencies } from '../enums/notifications-frequencies.enum';

export interface WeatherUpdateNotificationsOptions {
  frequency: NotificationsFrequencies;
  subject: string;
}
