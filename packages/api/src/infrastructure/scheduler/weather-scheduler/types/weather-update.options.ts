import { Frequency } from 'src/domain/subscription/valueObjects/frequency.vo';
import { NotificationSubjects } from '../../../../application/notifications/constants/enums/notification-subjects.enum';

export type WeatherUpdateOptions = {
  frequency: Frequency;
  subject: NotificationSubjects;
  invalidateCache: boolean;
};
