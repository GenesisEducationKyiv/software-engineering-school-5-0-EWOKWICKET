import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { InvalidTokenException } from '../../subscriptions/errors/invalid-token.error';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new InvalidTokenException();
    }

    return value;
  }
}
