import { Injectable, Module } from '@nestjs/common';
import { CityProviderAdapter } from 'src/infrastructure/city/wrappers/city-provider.adapter';
import { OpenWeatherCityProvider } from '../../infrastructure/city/providers/openweather.provider';
import { WeatherApiCityProvider } from '../../infrastructure/city/providers/weatherapi.provider';
import { ChainableCityProvider } from './interfaces/chainable-city.provider';
import { CityProvider } from './interfaces/city-provider.abstract';
import { CityExistsConstraint } from './validators/city-exists.constraint';

@Injectable()
class WeatherProviderMock extends ChainableCityProvider {
  async validateCity(city: string): Promise<boolean> {
    return city === 'CityValid';
  }
}

@Module({
  providers: [
    CityExistsConstraint,
    { provide: WeatherApiCityProvider, useClass: WeatherProviderMock },
    { provide: OpenWeatherCityProvider, useClass: WeatherProviderMock },
    {
      provide: CityProvider,
      inject: [WeatherApiCityProvider, OpenWeatherCityProvider],
      useFactory: (provider1: WeatherApiCityProvider, provider2: OpenWeatherCityProvider) => {
        return new CityProviderAdapter(provider1.setNext(provider2));
      },
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityTestModule {}
