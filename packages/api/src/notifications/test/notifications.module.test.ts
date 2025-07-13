import { Module } from '@nestjs/common';
import { NotificationsFacadeInterface } from 'src/common/interfaces/notifications-facade.interface';
import { NotificationsServiceInterface } from 'src/notifications/application/interfaces/notifications-service.abstract';
import { NotificationsFacade } from '../public/notifications.facade';

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
