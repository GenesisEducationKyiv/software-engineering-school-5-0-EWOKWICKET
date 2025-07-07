import { NotificationType } from 'src/application/notifications/constants/notification-type.enum';
import { Notification } from 'src/application/notifications/constants/notification.type';

export interface NotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'NotificationsSender';
