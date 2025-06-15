import { Notification } from 'src/common/constants/types/notification.interface';

export interface INotificationsService {
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}
