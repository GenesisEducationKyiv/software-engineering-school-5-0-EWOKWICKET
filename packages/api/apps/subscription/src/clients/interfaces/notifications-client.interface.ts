import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@proto/notifications';

export abstract class NotificationsClient {
  abstract sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType);
  abstract sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType);
}
