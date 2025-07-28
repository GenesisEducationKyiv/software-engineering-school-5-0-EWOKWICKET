import { HttpStatus } from '@nestjs/common';

export class ExternalApiError extends Error {
  public status = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(message = 'External API error occured') {
    super(message);
    this.name = 'ExternalApiError';
  }
}
