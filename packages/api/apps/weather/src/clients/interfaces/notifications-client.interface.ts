import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';

export abstract class NotificationsClient {
  abstract sendWeatherUpdateNotification(data: unknown, type: NotificationType);
}
