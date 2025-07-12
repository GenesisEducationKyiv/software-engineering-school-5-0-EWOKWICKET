import { NotificationType } from 'src/common/notifications/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from 'src/notifications/application/constants/notification.type';

export abstract class NotificationsFacadeInterface {
  abstract sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  abstract sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}
