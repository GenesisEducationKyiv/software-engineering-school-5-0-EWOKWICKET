import { Injectable, Module } from '@nestjs/common';
import { ChainableCityProvider } from 'src/application/city/interfaces/chainable-city.provider';
import { CityProvider } from 'src/application/city/interfaces/city-provider.abstract';
import { CityExistsConstraint } from 'src/application/city/validators/city-exists.constraint';
import { OpenWeatherCityProvider } from 'src/infrastructure/city/providers/openweather.provider';
import { WeatherApiCityProvider } from 'src/infrastructure/city/providers/weatherapi.provider';
import { CityProviderAdapter } from 'src/infrastructure/city/wrappers/city-provider.adapter';

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
