import { CreateSubscriptionDto } from '../../presentation/dtos/create-subscription.dto';

export abstract class SubscriptionClient {
  abstract subscribe(subscribeDto: CreateSubscriptionDto): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}
