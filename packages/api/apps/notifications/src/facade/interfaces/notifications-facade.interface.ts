import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@proto/notifications';

export abstract class NotificationsFacadeInterface {
  abstract sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void>;
  abstract sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void>;
}
