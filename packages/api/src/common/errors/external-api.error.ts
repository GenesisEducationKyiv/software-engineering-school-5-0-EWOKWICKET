import { HttpException, HttpStatus } from '@nestjs/common';

export class ExternalApiException extends HttpException {
  constructor(message: string = 'Exteranl API error occured') {
    super(
      {
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
