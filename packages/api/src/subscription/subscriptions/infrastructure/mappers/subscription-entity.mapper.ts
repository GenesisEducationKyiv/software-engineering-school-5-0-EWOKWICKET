import { Subscription } from '../../domain/subscription.entity';
import { SubscriptionDb } from '../persistence/schemas/subscription.schema';

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
