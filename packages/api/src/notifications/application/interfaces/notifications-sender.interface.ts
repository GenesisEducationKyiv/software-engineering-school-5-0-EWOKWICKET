import { NotificationType } from '../../application/constants/notification-type.enum';
import { Notification } from '../../application/constants/notification.type';

export interface NotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'NotificationsSender';
