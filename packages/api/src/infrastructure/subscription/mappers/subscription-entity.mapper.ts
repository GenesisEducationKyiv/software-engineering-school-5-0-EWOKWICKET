import { Subscription } from 'src/domain/subscription/subscription.entity';
import { SubscriptionDb } from '../schemas/subscription.schema';

export class SubscriptionEntityMapper {
  static toEntity(sub: SubscriptionDb): Subscription {
    return {
      _id: sub._id.toString(),
      email: sub.email,
      city: sub.city,
      frequency: sub.frequency,
      confirmed: sub.confirmed,
      expiresAt: sub.expiresAt,
    };
  }
}
