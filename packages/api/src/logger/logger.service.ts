import { Injectable } from '@nestjs/common';
import { localTimestampFormat } from 'src/common/utils/timezone';
import { createLogger, format, Logger, transports } from 'winston';

const { combine, timestamp, json, prettyPrint } = format;

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: combine(timestamp({ format: localTimestampFormat }), json(), prettyPrint()),
      transports: [new transports.File({ filename: 'logs/provider.log' })],
    });
  }

  async logProviderAction(message: string, providerName: string, data: unknown): Promise<void> {
    this.logger.info({ message, providerName, data: data || {} });
  }
}
