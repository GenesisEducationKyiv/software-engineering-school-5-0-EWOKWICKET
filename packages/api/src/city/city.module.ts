import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { CityExistsConstraint } from './constraints/city-exists.constraint';
import { CityProviderChain, CityValidationFactory } from './factories/city-validation.factory';
import { OpenWeatherCityValidation } from './providers/openweather.provider';
import { WeatherApiCityValidation } from './providers/weatherapi.provider';

@Module({
  imports: [HttpModule.register({}), LoggerModule],
  providers: [
    CityExistsConstraint,
    WeatherApiCityValidation,
    OpenWeatherCityValidation,
    CityValidationFactory,
    {
      provide: CityProviderChain,
      useFactory: (cityFactory: CityValidationFactory) => {
        return cityFactory.create();
      },
      inject: [CityValidationFactory],
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityModule {}
