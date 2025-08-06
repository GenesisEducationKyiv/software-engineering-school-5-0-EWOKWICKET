import { CreateSubscriptionRequest } from '@proto/subscription';
import { CreateSubscriptionDto } from 'src/subscription/presentation/dtos/create-subscription.dto';

export class DtoRequestMapper {
  static toEntity(data: CreateSubscriptionDto): CreateSubscriptionRequest {
    return {
      email: data.email,
      city: data.city,
      frequency: data.frequency,
    };
  }
}
