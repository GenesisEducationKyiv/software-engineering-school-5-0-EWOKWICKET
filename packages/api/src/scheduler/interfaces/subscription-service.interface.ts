import { RootFilterQuery } from 'mongoose';
import { ISubscription } from 'src/common/constants/types/subscription.interface';
import { Subscription } from 'src/database/schemas/subscription.schema';

export interface ISubscriptionService {
  find(options: RootFilterQuery<Subscription>): Promise<ISubscription[]>;
}

export const SubscriptionServiceToken = 'SubscriptionService';
