import { RootFilterQuery } from 'mongoose';
import { Subscription } from 'src/infrastructure/subscription/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../../../application/subscriptions/dtos/create-subscription.dto';

export abstract class SubscriptionServiceInterface {
  abstract subscribe(subscribeDto: CreateSubscriptionDto): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}

export abstract class SubscriptionServiceLookup {
  abstract find(options: RootFilterQuery<Subscription>): Promise<Subscription[]>;
}
