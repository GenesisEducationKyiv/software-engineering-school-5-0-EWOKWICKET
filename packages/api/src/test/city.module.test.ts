import { Injectable, Module } from '@nestjs/common';
import { ChainableCityProvider } from 'src/city/application/interfaces/chainable-city.provider';
import { CityProvider } from 'src/city/application/interfaces/city-provider.abstract';
import { CityExistsConstraint } from 'src/city/application/validators/city-exists.constraint';
import { OpenWeatherCityProvider } from 'src/city/infrastructure/providers/openweather.provider';
import { WeatherApiCityProvider } from 'src/city/infrastructure/providers/weatherapi.provider';
import { CityProviderAdapter } from 'src/city/infrastructure/wrappers/city-provider.adapter';

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
