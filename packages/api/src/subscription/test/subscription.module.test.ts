import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsClient } from '../clients/interfaces/notifications-client.interface';
import { WeatherClient } from '../clients/interfaces/weather-client.interface';
import { NotificationsHttpClient } from '../clients/notifications.http-client';
import { WeatherHttpClient } from '../clients/weather.http-client';
import { databaseTestConfig } from '../config/test.config';
import { SubscriptionFacadeInterface } from '../facade/interfaces/subscription-facade.interface';
import { SubscriptionFacade } from '../facade/subscription.facade';
import { SubscriptionController } from '../presentation/subcription.controller';
import { DatabaseTestModule } from './database.module.test';
import { SubscriptionDomainTestModule } from './subscriptions-domain.module.test';

@Module({
  imports: [
    HttpModule.register({ global: true }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [databaseTestConfig],
    }),
    DatabaseTestModule,
    SubscriptionDomainTestModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    { provide: SubscriptionFacadeInterface, useClass: SubscriptionFacade },
    { provide: WeatherClient, useClass: WeatherHttpClient },
    { provide: NotificationsClient, useClass: NotificationsHttpClient },
  ],
  exports: [SubscriptionFacadeInterface, WeatherClient, NotificationsClient],
})
export class SubscriptionTestModule {}
