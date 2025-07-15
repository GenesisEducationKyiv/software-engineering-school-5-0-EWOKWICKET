import { Frequency } from '@common/contracts/subscription/domain/frequency.vo';

export type CreateSubscriptionDto = {
  email: string;
  city: string;
  frequency: Frequency;
};
