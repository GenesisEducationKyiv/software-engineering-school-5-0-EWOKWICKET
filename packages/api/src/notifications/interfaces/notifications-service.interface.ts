import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from 'src/notifications/constants/types/notification.interface';

export abstract class NotificationsServiceInterface {
  abstract sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  abstract sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}
