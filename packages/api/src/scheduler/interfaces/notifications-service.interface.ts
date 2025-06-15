import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { ConfirmationNotification, UpdateWeatherNotification } from 'src/common/constants/types/notification.interface';

export interface INotificationsService {
  sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  sendWeatherUpdateNotification(data: UpdateWeatherNotification, type: NotificationType): Promise<void>;
}

export const NotificationsServiceToken = 'NotificationsService';
