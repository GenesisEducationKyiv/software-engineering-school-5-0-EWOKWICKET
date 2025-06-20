import { NotificationsFrequencies } from '../enums/notification-frequencies.enum';

export interface WeatherUpdateNotificationsOptions {
  frequency: NotificationsFrequencies;
  subject: string;
}
