import { RootFilterQuery } from 'mongoose';
import { Subscription, SubscriptionWithId } from 'src/database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

export abstract class ControllerSubscriptionService {
  abstract subscribe(subscribeDto: CreateSubscriptionDto): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}

export abstract class FindSubscriptionService {
  abstract find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]>;
}
