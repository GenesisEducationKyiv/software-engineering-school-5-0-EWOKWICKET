import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Notification } from '@proto/notifications';

export interface NotificationsSender {
  type: NotificationType;
  sendConfirmationNotification(data: Notification): Promise<void>;
  sendWeatherUpdateNotification(data: Notification): Promise<void>;
}

export const NotificationsSenderToken = 'NotificationsSender';
