import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { Notification } from 'src/common/constants/types/notification.interface';

export interface INotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'INotificationsSender';
