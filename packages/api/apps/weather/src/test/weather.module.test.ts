import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NotificationsHttpClient } from 'src/clients/notifications.http-client';
import { NotificationsClient } from '../clients/interfaces/notifications-client.interface';
import { SubscriptionClient } from '../clients/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from '../clients/subscription.http-client';
import { WeatherFacadeInterface } from '../facade/interfaces/weather-facade.interface';
import { WeatherFacade } from '../facade/weather.facade';
import { CityTestModule } from './city.module.test';
import { WeatherAPITestModule } from './weather-api.module.test';

@Module({
  imports: [HttpModule.register({ global: true }), WeatherAPITestModule, CityTestModule],
  providers: [
    { provide: WeatherFacadeInterface, useClass: WeatherFacade },
    { provide: SubscriptionClient, useClass: SubscriptionHttpClient },
    { provide: NotificationsClient, useClass: NotificationsHttpClient },
  ],
  exports: [WeatherFacadeInterface, SubscriptionClient, NotificationsClient],
})
export class WeatherTestModule {}
