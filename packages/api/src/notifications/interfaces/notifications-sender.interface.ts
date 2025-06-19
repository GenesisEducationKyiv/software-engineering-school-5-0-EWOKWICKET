import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { Notification } from 'src/notifications/constants/types/notification.interface';

export interface NotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'INotificationsSender';
