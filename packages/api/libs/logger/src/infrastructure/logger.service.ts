import { ErrorMetadata, InfoMetadata } from '@logger/application/constants/log.types';
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
      format: combine(
        format((info) => {
          info.labels = {
            app: 'WeatherForecast',
            service: options.service,
            ...(info.labels as Record<string, any>), // dynamic labels configuration
          };
          return info;
        })(),
        timestamp({ format: localTimestampFormat }),
        json(),
        prettyPrint(),
      ),
      transports: [
        new LokiTransport({
          host,
          basicAuth,
          onConnectionError: (err) => console.error('Loki connection error:', err),
          json: true,
        }),
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  info(message: string, meta: InfoMetadata) {
    this.logger.info(message, meta);
  }

  error(message: string, meta: ErrorMetadata) {
    this.logger.error(message, meta);
  }

  warn(message: string, meta: ErrorMetadata) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta: InfoMetadata) {
    this.logger.debug(message, meta);
  }
}
