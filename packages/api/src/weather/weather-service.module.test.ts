import { Module } from '@nestjs/common';
import { CityTestModule } from './city/city.module.test';
import { WeatherTestModule } from './weather/weather.module.test';

@Module({
  imports: [WeatherTestModule, CityTestModule],
})
export class WeatherServiceModule {}
