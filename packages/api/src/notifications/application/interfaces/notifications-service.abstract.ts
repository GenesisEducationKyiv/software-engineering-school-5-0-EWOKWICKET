import { NotificationType } from '../../application/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '../../application/constants/notification.type';

export abstract class NotificationsServiceInterface {
  abstract sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  abstract sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}
