export class ValidationError extends Error {
  constructor(
    public readonly message: string,
    public readonly validationDetails?: { [field: string]: string[] },
  ) {
    super(message);
    this.name = 'ValidationError';
    // Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
