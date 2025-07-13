import { Module } from '@nestjs/common';
import { CityFacadeInterface, WeatherFacadePublic } from 'src/common/interfaces/weather-facade.interfaces';
import { WeatherFacade } from '../public/weather.facade';
import { CityTestModule } from './city.module.test';
import { WeatherAPITestModule } from './weather-api.module.test';

@Module({
  imports: [WeatherAPITestModule, CityTestModule],
  providers: [WeatherFacade, { provide: WeatherFacadePublic, useExisting: WeatherFacade }, { provide: CityFacadeInterface, useExisting: WeatherFacade }],
  exports: [WeatherFacadePublic, CityFacadeInterface],
})
export class WeatherTestModule {}
