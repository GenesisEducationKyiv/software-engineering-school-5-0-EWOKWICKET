import { RootFilterQuery } from 'mongoose';
import { Subscription, SubscriptionWithId } from 'src/database/schemas/subscription.schema';

export interface FindSubscriptionService {
  find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]>;
}

export const FindSubscriptionServiceToken = 'FindSubscriptionService';
