import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from 'src/notifications/constants/types/notification.interface';

export interface NotificationsService {
  sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}

export const NotificationsServiceToken = 'NotificationsService';
