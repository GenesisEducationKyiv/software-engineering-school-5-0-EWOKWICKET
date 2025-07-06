import { Injectable, Module } from '@nestjs/common';
import { ChainableCityProvider } from 'src/domain/city/chainable-city.provider';
import { CityProvider } from 'src/domain/city/city-provider.abstract';
import { CityProviderAdapter } from 'src/infrastructure/city/adapters/city-provider.adapter';
import { OpenWeatherCityProvider } from '../../infrastructure/city/providers/openweather.provider';
import { WeatherApiCityProvider } from '../../infrastructure/city/providers/weatherapi.provider';
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
