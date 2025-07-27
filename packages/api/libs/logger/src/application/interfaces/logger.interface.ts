import { Data } from '../constants/data.type';

export abstract class LoggerInterface {
  abstract info(message: string, data: Data);
  abstract error(message: string, data: Data, trace?: string);
  abstract warn(message: string, data: Data);
  abstract debug(message: string, data: Data);
}
