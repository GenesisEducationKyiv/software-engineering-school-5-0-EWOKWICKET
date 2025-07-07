import { Frequency } from 'src/domain/subscription/frequency.vo';
import { NotificationSubjects } from '../../../../application/notifications/constants/notification-subjects.enum';

export type WeatherUpdateOptions = {
  frequency: Frequency;
  subject: NotificationSubjects;
  invalidateCache: boolean;
};
