import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';

export abstract class NotificationsServiceInterface {
  abstract sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  abstract sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}
