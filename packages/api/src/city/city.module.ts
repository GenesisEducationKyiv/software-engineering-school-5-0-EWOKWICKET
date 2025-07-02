import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { CityExistsConstraint } from './constraints/city-exists.constraint';
import { CityProviderFactory } from './factories/city-provider.factory';
import { ChainableCityProvider } from './interfaces/chainable-city.provider';
import { OpenWeatherCityProvider } from './providers/openweather.provider';
import { WeatherApiCityProvider } from './providers/weatherapi.provider';

@Module({
  imports: [HttpModule.register({}), LoggerModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityProvider,
    OpenWeatherCityProvider,
    CityProviderFactory,
    {
      provide: ChainableCityProvider,
      useFactory: (cityFactory: CityProviderFactory) => {
        return cityFactory.create();
      },
      inject: [CityProviderFactory],
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
