import { Frequency } from 'src/common/subscription/domain/frequency.vo';

export abstract class SubscriptionClient {
  abstract getGroupedSubscriptionsByFrequency(frequency: Frequency);
}
