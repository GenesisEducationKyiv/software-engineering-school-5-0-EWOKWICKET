import { Frequency } from '../subscription/domain/frequency.vo';

export abstract class SubscriptionFacadeGroup {
  abstract getGroupedSubscriptionsByFrequency(frequency: Frequency);
}

export abstract class SubscriptionFacadePublic {
  abstract subscribe(subscribeDto: unknown): Promise<void>;
  abstract confirm(token: string): Promise<void>;
  abstract unsubscribe(token: string): Promise<void>;
}
