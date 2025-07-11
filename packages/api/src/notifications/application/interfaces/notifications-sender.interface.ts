import { NotificationType } from '../constants/notification-type.enum';
import { Notification } from '../constants/notification.type';

export interface NotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'NotificationsSender';
