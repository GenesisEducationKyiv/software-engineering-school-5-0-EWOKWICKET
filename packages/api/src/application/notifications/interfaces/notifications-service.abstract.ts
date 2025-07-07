import { NotificationType } from 'src/application/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from 'src/application/notifications/constants/notification.type';

export abstract class NotificationsServiceInterface {
  abstract sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  abstract sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}
