import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionController } from '../subscription/presentation/subcription.controller';
import { DatabaseTestModule } from './database.module.test';
import { SubscriptionTestModule } from './subscriptions.module.test';
import { NotificationsClient } from 'src/common/clients/interfaces/notifications-client.interface';
import { WeatherClient } from 'src/common/clients/interfaces/weather-client.interface';

const weatherMock: WeatherClient = {
  cityExists: async (city: string) => city === 'CityValid',
  getCurrentWeather: async (city: string) => undefined,
};

const notificationsMock: NotificationsClient = {
  sendConfirmationNotification: async () => {},
  sendWeatherUpdateNotification: async () => {},
};

@Module({
  imports: [
    HttpModule.register({ global: true }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appTestConfig, databaseTestConfig],
    }),
    DatabaseTestModule,
    SubscriptionTestModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    { provide: SubscriptionFacadeInterface, useClass: SubscriptionFacade },
    { provide: WeatherClient, useValue: weatherMock },
    { provide: NotificationsClient, useValue: notificationsMock },
  ],
  exports: [SubscriptionFacadeInterface, WeatherClient, NotificationsClient],
})
export class AppTestModule {}
