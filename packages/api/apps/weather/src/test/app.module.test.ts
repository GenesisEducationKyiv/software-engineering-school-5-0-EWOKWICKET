import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appTestConfig } from 'src/config/test.config';
import { WeatherController } from 'src/presentation/weather.controller';
import { WeatherFacadeInterface } from '../facade/interfaces/weather-facade.interface';
import { WeatherFacade } from '../facade/weather.facade';
import { CityTestModule } from './city.module.test';
import { WeatherTestModule } from './weather.module.test';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [appTestConfig],
    }),
    HttpModule.register({ global: true }),
    WeatherTestModule,
    CityTestModule,
  ],
  controllers: [WeatherController],
  providers: [{ provide: WeatherFacadeInterface, useClass: WeatherFacade }],
  exports: [WeatherFacadeInterface],
})
export class AppTestModule {}
