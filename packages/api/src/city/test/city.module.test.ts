import { Module } from '@nestjs/common';
import { LoggerTestModule } from 'src/logger/test/logger.module.test';
import { CityExistsConstraint } from '../constraints/city-exists.constraint';
import { OpenWeatherCityProvider } from '../providers/openweather.provider';
import { WeatherApiCityProvider } from '../providers/weatherapi.provider';

// const cityFetchMock: CityFetch = {
//   searchCitiesRaw: async () => [{ name: 'Valid', region: '', country: '' }],
// };

@Module({
  imports: [LoggerTestModule],
  providers: [CityExistsConstraint, WeatherApiCityProvider, OpenWeatherCityProvider],
  exports: [CityExistsConstraint],
})
export class CityTestModule {}
