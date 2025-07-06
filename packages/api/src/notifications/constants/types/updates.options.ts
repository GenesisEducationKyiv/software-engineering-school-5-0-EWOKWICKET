import { NotificationsFrequencies } from '../enums/notification-frequencies.enum';

export interface WeatherUpdateOptions {
  frequency: NotificationsFrequencies;
  subject: string;
  invalidateCache: boolean;
}
