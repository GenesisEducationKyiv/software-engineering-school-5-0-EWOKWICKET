import { HttpStatus } from '@nestjs/common';

export class CityNotFoundError extends Error {
  public status = HttpStatus.NOT_FOUND;

  constructor(message = 'City not found') {
    super(message);
    this.name = 'CityNotFoundError';
    Object.setPrototypeOf(this, CityNotFoundError.prototype);
  }
}
