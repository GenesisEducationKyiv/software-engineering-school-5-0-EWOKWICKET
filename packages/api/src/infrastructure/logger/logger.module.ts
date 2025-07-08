import { Module } from '@nestjs/common';
import { ProviderLogger } from 'src/common/interfaces/logger.interface';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    {
      provide: ProviderLogger,
      useClass: LoggerService,
    },
  ],
  exports: [ProviderLogger],
})
export class LoggerModule {}
