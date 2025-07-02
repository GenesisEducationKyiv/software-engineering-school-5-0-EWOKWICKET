import { Module } from '@nestjs/common';
import { NotificationsServiceInterface } from '../interfaces/notifications-service.interface';

const notificationsServiceMock: NotificationsServiceInterface = {
  sendConfirmationNotification: async () => {},
  sendWeatherUpdateNotification: async () => {},
};

@Module({
  providers: [
    {
      provide: NotificationsServiceInterface,
      useValue: notificationsServiceMock,
    },
  ],
  exports: [NotificationsServiceInterface],
})
export class NotificationsTestModule {}
