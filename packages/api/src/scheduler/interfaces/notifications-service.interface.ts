import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from 'src/notifications/constants/notification.interface';

export interface INotificationsService {
  sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}

export const NotificationsServiceToken = 'NotificationsService';
