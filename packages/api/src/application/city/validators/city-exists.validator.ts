import { registerDecorator, ValidationOptions } from 'class-validator';
import { CityExistsConstraint } from 'src/application/city/validators/city-exists.constraint';

export function CityExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'CityExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: CityExistsConstraint,
    });
  };
}
