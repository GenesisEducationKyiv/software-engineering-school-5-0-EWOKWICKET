import { HttpException, HttpStatus } from '@nestjs/common';

export class CityNotFoundException extends HttpException {
  constructor(message: string = 'City not found') {
    super(
      {
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
