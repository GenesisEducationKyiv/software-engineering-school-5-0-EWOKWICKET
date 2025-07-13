import { Module } from '@nestjs/common';
import { CityFacadeInterface, WeatherFacadeInterface } from 'src/common/interfaces/weather-facade.interfaces';
import { WeatherFacade } from '../public/weather.facade';
import { CityTestModule } from './city.module.test';
import { WeatherTestModule } from './weather.module.test';

@Module({
  imports: [WeatherTestModule, CityTestModule],
  providers: [WeatherFacade, { provide: WeatherFacadeInterface, useExisting: WeatherFacade }, { provide: CityFacadeInterface, useExisting: WeatherFacade }],
  exports: [WeatherFacadeInterface, CityFacadeInterface],
})
export class WeatherServiceTestModule {}
