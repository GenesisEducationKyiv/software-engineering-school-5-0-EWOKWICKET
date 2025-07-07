import { Frequency } from './frequency.vo';

export class Subscription {
  _id: string;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  expiresAt: Date;
}
