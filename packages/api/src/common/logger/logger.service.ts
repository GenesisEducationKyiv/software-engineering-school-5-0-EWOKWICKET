import { Injectable } from '@nestjs/common';
import { ProviderLogger } from 'src/common/interfaces/logger.interface';
import { createLogger, format, Logger, transports } from 'winston';
import { localTimestampFormat } from './configs/timezone';

const { combine, timestamp, json, prettyPrint } = format;

@Injectable()
export class LoggerService implements ProviderLogger {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: combine(timestamp({ format: localTimestampFormat }), json(), prettyPrint()),
      transports: [new transports.File({ filename: 'logs/provider.log' })],
    });
  }

  async logProvider(message: string, executor: string, data: unknown = {}): Promise<void> {
    this.logger.info({ message, executor, data });
  }
}
