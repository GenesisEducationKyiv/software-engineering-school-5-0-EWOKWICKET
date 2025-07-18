export abstract class SubscriptionFacadeInterface {
  //public
  abstract subscribe(subscribeDto: unknown): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}
