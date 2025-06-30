import { Module } from '@nestjs/common';
import { LoggerTestModule } from 'src/logger/test/logger.module.test';
import { CityExistsConstraint } from '../constraints/city-exists.constraint';
import { OpenWeatherCityValidation } from '../providers/openweather.provider';
import { WeatherApiCityValidation } from '../providers/weatherapi.provider';

// const cityFetchMock: CityFetch = {
//   searchCitiesRaw: async () => [{ name: 'Valid', region: '', country: '' }],
// };

@Module({
  imports: [LoggerTestModule],
  providers: [CityExistsConstraint, WeatherApiCityValidation, OpenWeatherCityValidation],
  exports: [CityExistsConstraint],
})
export class CityTestModule {}
