import { HttpException, HttpStatus } from '@nestjs/common';

export class CityNotFoundException extends HttpException {
  constructor(possibleLocations?: string[]) {
    super(
      {
        message: 'City not found',
        possibleLocations,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
