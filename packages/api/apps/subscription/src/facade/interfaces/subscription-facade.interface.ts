import { Frequency } from '@common/contracts/subscription/domain/frequency.vo';

export abstract class SubscriptionFacadeInterface {
  //public
  abstract subscribe(subscribeDto: unknown): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;

  //internal
  abstract getGroupedSubscriptionsByFrequency(frequency: Frequency);
}
