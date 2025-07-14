export abstract class SubscriptionClient {
  abstract subscribe(subscribeDto: unknown);
  abstract confirm(token: string);
  abstract unsubscribe(token: string);
}
