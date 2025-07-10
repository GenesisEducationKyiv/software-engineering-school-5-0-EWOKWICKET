import { NotificationSubjects } from 'src/notifications/application/constants/notification-subjects.enum';
import { Frequency } from 'src/subscriptions/domain/frequency.vo';

export type WeatherUpdateOptions = {
  frequency: Frequency;
  subject: NotificationSubjects;
  invalidateCache?: boolean;
};
