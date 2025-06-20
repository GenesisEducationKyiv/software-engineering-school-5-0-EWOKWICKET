import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException {
  constructor(message: string = 'Invalid Token') {
    super(
      {
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
