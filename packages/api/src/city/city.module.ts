import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { LoggerModule } from 'src/logger/logger.module';
import { CityExistsConstraint } from './city-exists.constraint';
import { CityProviderFactory } from './factories/city-provider.factory';
import { CityProvider } from './interfaces/city.provider';
import { OpenWeatherCityProvider } from './providers/openweather.provider';
import { WeatherApiCityProvider } from './providers/weatherapi.provider';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityProvider,
    OpenWeatherCityProvider,
    CityProviderFactory,
    {
      provide: CityProvider,
      inject: [CityProviderFactory],
      useFactory: (cityFactory: CityProviderFactory) => cityFactory.create(),
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
