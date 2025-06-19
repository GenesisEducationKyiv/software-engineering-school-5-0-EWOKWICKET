import { NotificationsFrequencies } from '../../common/constants/enums/notifications-frequencies.enum';

export interface WeatherUpdateNotificationsOptions {
  frequency: NotificationsFrequencies;
  subject: string;
}
