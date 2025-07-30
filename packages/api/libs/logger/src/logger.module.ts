import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerOptions } from './application/constants/logger.options';
import { LoggerInterface } from './application/interfaces/logger.interface';
import { LoggerService } from './infrastructure/logger.service';
import { SamplerProxy } from './infrastructure/proxies/sampling.proxy';

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      global: true,
      module: LoggerModule,
      providers: [
        {
          provide: LoggerInterface,
          inject: [ConfigService],
          //prettier-ignore
          useFactory: (configService: ConfigService) => {
            return new SamplerProxy(
              new LoggerService(configService, options), 
              options
            );
          },
        },
      ],
      exports: [LoggerInterface],
    };
  }
}
