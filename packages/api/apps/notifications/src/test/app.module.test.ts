import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsServiceInterface } from 'src/application/interfaces/notifications-service.abstract';
import { appTestConfig } from 'src/config/test.config';
import { NotificationsFacadeInterface } from 'src/facade/interfaces/notifications-facade.interface';
import { NotificationsFacade } from '../facade/notifications.facade';
import { NotificationsController } from '../presentation/notifications.controller';

const notificationsServiceMock: NotificationsServiceInterface = {
  sendConfirmationNotification: async () => {},
  sendWeatherUpdateNotification: async () => {},
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [appTestConfig],
    }),
    HttpModule.register({ global: true }),
  ],
  controllers: [NotificationsController],
  providers: [
    { provide: NotificationsServiceInterface, useValue: notificationsServiceMock },
    { provide: NotificationsFacadeInterface, useClass: NotificationsFacade },
  ],
})
export class AppTestModule {}
