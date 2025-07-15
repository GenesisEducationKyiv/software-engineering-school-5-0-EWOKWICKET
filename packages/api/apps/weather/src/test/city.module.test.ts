import { Injectable, Module } from '@nestjs/common';
import { ChainableCityProvider } from '../city/application/interfaces/chainable-city.provider';
import { CityProvider } from '../city/application/interfaces/city-provider.abstract';
import { OpenWeatherCityProvider } from '../city/infrastructure/providers/openweather.provider';
import { WeatherApiCityProvider } from '../city/infrastructure/providers/weatherapi.provider';
import { CityProviderAdapter } from '../city/infrastructure/wrappers/city-provider.adapter';

@Injectable()
class WeatherProviderMock extends ChainableCityProvider {
  async cityExists(city: string): Promise<boolean> {
    return city === 'CityValid';
  }
}

@Module({
  providers: [
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
  exports: [CityProvider],
})
export class CityTestModule {}
