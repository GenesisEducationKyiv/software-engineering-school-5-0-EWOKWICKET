import { Module } from '@nestjs/common';
import { NotificationsServiceInterface } from 'src/notifications/application/interfaces/notifications-service.abstract';
import { NotificationsFacadeInterface } from 'src/notifications/facade/interfaces/notifications-facade.interface';
import { NotificationsFacade } from '../facade/notifications.facade';

const notificationsServiceMock: NotificationsServiceInterface = {
  sendConfirmationNotification: async () => {},
  sendWeatherUpdateNotification: async () => {},
};

@Module({
  providers: [
    { provide: NotificationsServiceInterface, useValue: notificationsServiceMock },
    { provide: NotificationsFacadeInterface, useClass: NotificationsFacade },
  ],
  exports: [NotificationsFacadeInterface],
})
export class NotificationsTestModule {}
