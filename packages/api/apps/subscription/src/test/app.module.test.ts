import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import urlsConfig from 'src/config/urls.config';
import { NotificationsClient } from '../clients/interfaces/notifications-client.interface';
import { WeatherClient } from '../clients/interfaces/weather-client.interface';
import { appTestConfig, databaseTestConfig } from '../config/test.config';
import { SubscriptionFacadeInterface } from '../facade/interfaces/subscription-facade.interface';
import { SubscriptionFacade } from '../facade/subscription.facade';
import { SubscriptionController } from '../presentation/subcription.controller';
import { DatabaseTestModule } from './database.module.test';
import { SubscriptionTestModule } from './subscriptions.module.test';

const weatherMock: WeatherClient = {
  cityExists: async (city: string) => city === 'CityValid',
  getCurrentWeather: async (_city: string) => undefined,
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
      load: [appTestConfig, databaseTestConfig, urlsConfig],
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
