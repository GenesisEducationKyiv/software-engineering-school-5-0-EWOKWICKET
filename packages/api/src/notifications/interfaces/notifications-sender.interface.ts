import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { Notification } from 'src/notifications/constants/notification.interface';

export interface NotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'INotificationsSender';
