import { validate } from 'class-validator';
import { ValidationError } from '../errors/validation.error';

export async function validateDto<T extends object>(dto: T): Promise<void> {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const message = errors.flatMap((e) => Object.values(e.constraints || {})).join('; ');

    throw new ValidationError(message);
  }
}
