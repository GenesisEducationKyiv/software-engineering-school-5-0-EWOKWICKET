import { RootFilterQuery } from 'mongoose';
import { Subscription } from 'src/domain/subscription/subscription.entity';
import { CreateSubscriptionDto } from '../../../presentation/subscription/dtos/create-subscription.dto';

export abstract class SubscriptionServiceInterface {
  abstract subscribe(subscribeDto: CreateSubscriptionDto): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}

export abstract class SubscriptionServiceLookup {
  abstract find(options: RootFilterQuery<Subscription>): Promise<Subscription[]>;
}
