import { NotificationSubjects } from 'src/common/notifications/constants/notification-subjects.enum';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';

export type WeatherUpdateOptions = {
  frequency: Frequency;
  subject: NotificationSubjects;
  invalidateCache?: boolean;
};
