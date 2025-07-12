import { Frequency } from 'src/common/subscription/domain/frequency.vo';

export class Subscription {
  _id: string;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  expiresAt: Date;
}
