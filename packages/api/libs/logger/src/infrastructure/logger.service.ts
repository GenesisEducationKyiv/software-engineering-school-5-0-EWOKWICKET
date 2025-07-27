import { Data } from '@logger/application/constants/data.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, Logger, transports } from 'winston';
import LokiTransport from 'winston-loki';
import { LoggerOptions } from '../application/constants/logger.options';
import { LoggerInterface } from '../application/interfaces/logger.interface';
import { localTimestampFormat } from '../utils/timezone';

const { combine, timestamp, json, prettyPrint } = format;

@Injectable()
export class LoggerService implements LoggerInterface {
  private readonly logger: Logger;

  constructor(configService: ConfigService, options: LoggerOptions) {
    const host = configService.get('logger.url');
    const basicAuth = configService.get('logger.auth');

    this.logger = createLogger({
      format: combine(timestamp({ format: localTimestampFormat }), json(), prettyPrint()),
      transports: [
        new LokiTransport({
          host,
          basicAuth,
          labels: { app: 'WeatherForecast', service: options.service },
          onConnectionError: (err) => console.error('Loki connection error:', err),
          json: true,
        }),
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  info(message: string, data?: Data) {
    this.logger.info(message, data);
  }

  error(message: string, data?: Data, trace?: string) {
    this.logger.error(message, data, { trace });
  }

  warn(message: string, data?: Data) {
    this.logger.warn(message, data);
  }

  debug(message: string, data?: Data) {
    this.logger.debug(message, data);
  }
}
