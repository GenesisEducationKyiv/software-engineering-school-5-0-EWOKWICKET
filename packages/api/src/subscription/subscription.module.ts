import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherClient } from './clients/interfaces/weather-client.interface';
import { WeatherHttpClient } from './clients/weather.http-client';
import databaseConfig from './config/database.config';
import { subscriptionEnvSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { SubscriptionFacadeInterface } from './facade/interfaces/subscription-facade.interface';
import { SubscriptionFacade } from './facade/subscription.facade';
import { SubscriptionController } from './presentation/subcription.controller';
import { SubscriptionDomainModule } from './subscription-domain/subscription-domain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: subscriptionEnvSchema,
    }),
    DatabaseModule,
    SubscriptionDomainModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    { provide: SubscriptionFacadeInterface, useClass: SubscriptionFacade },
    { provide: WeatherClient, useClass: WeatherHttpClient },
  ],
  exports: [SubscriptionFacadeInterface, WeatherClient],
})
export class SubscriptionModule {}
