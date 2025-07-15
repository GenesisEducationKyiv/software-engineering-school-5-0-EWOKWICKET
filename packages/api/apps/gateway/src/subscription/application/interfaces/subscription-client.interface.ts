import { CreateSubscriptionDto } from '../../presentation/dtos/create-subscription.dto';

export abstract class SubscriptionClient {
  abstract subscribe(subscribeDto: CreateSubscriptionDto);
  abstract confirm(token: string);
  abstract unsubscribe(token: string);
}
