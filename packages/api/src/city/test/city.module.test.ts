import { Injectable, Module } from '@nestjs/common';
import { CityProviderAdapter } from 'src/common/adapters/city-provider.adapter';
import { CityExistsConstraint } from '../city-exists.constraint';
import { ChainableCityProvider } from '../interfaces/chainable-city.provider';
import { CityProvider } from '../interfaces/city.provider';
import { OpenWeatherCityProvider } from '../providers/openweather.provider';
import { WeatherApiCityProvider } from '../providers/weatherapi.provider';

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
      useFactory: (provider1: WeatherApiCityProvider, provider2: OpenWeatherCityProvider) => {
        return new CityProviderAdapter(provider1.setNext(provider2));
      },
      inject: [WeatherApiCityProvider, OpenWeatherCityProvider],
    },
  ],
  exports: [CityExistsConstraint],
})
export class CityTestModule {}
