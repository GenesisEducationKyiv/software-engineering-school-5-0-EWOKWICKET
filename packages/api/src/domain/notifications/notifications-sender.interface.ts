import { NotificationType } from 'src/application/notifications/constants/enums/notification-type.enum';
import { Notification } from 'src/application/notifications/constants/types/notification.interface';

export interface NotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'NotificationsSender';
