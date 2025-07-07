import { SubscriptionEntity } from 'src/domain/subscription/subscription.entity';
import { Subscription } from '../schemas/subscription.schema';

export class SubscriptionEntityMapper {
  static toEntity(sub: Subscription): SubscriptionEntity {
    return {
      _id: sub._id,
      email: sub.email,
      city: sub.email,
      frequency: sub.frequency,
      confirmed: sub.confirmed,
      expiresAt: sub.expiresAt,
    };
  }
}
