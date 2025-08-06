import { Subscription } from '../../domain/subscription.entity';

export class SubscriptionEntityMapper {
  static toEntity(sub: Subscription): Subscription {
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
