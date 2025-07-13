import { RootFilterQuery } from 'mongoose';
import { CreateSubscriptionDto } from 'src/gateway/subscription/dtos/create-subscription.dto';
import { Subscription } from '../../domain/subscription.entity';

export abstract class SubscriptionServiceInterface {
  abstract subscribe(subscribeDto: CreateSubscriptionDto): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}

export abstract class SubscriptionServiceLookup {
  abstract find(options: RootFilterQuery<Subscription>): Promise<Subscription[]>;
}
