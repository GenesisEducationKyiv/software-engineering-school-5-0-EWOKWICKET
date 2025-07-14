import { Module } from '@nestjs/common';
import { SubscriptionClient } from '../clients/interfaces/subscription-client.interface';
import { SubscriptionHttpClient } from '../clients/subscription.http-client';
import { WeatherFacadeInterface } from '../facade/interfaces/weather-facade.interface';
import { WeatherFacade } from '../facade/weather.facade';
import { CityTestModule } from './city.module.test';
import { WeatherAPITestModule } from './weather-api.module.test';

@Module({
  imports: [WeatherAPITestModule, CityTestModule],
  providers: [
    { provide: WeatherFacadeInterface, useClass: WeatherFacade },
    { provide: SubscriptionClient, useClass: SubscriptionHttpClient },
  ],
  exports: [WeatherFacadeInterface, SubscriptionClient],
})
export class WeatherTestModule {}
