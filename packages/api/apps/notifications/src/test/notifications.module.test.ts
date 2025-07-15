import { Module } from '@nestjs/common';
import { NotificationsServiceInterface } from 'src/notifications/application/interfaces/notifications-service.abstract';
import { NotificationsFacadeInterface } from 'src/notifications/src/facade/interfaces/notifications-facade.interface';
import { NotificationsFacade } from '../facade/notifications.facade';
import { NotificationsController } from '../presentation/notifications.controller';

const notificationsServiceMock: NotificationsServiceInterface = {
  sendConfirmationNotification: async () => {},
  sendWeatherUpdateNotification: async () => {},
};

@Module({
  controllers: [NotificationsController],
  providers: [
    { provide: NotificationsServiceInterface, useValue: notificationsServiceMock },
    { provide: NotificationsFacadeInterface, useClass: NotificationsFacade },
  ],
})
export class NotificationsTestModule {}
