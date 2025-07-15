import { NotificationSubjects } from '@common/contracts/notifications/constants/notification-subjects.enum';
import { Frequency } from '@common/contracts/subscription/domain/frequency.vo';

export type WeatherUpdateOptions = {
  frequency: Frequency;
  subject: NotificationSubjects;
  invalidateCache?: boolean;
};
