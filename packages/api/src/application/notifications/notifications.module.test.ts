import { Module } from '@nestjs/common';
import { NotificationsServiceInterface } from 'src/domain/notifications/notifications-service.abstract';

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
