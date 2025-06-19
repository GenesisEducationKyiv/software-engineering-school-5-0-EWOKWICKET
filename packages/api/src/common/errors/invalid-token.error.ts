import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException {
  constructor() {
    super(
      {
        message: 'Invalid Token',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
