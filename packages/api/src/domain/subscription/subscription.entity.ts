import { Types } from 'mongoose';
import { Frequency } from './valueObjects/frequency.vo';

export class SubscriptionEntity {
  _id: Types.ObjectId;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  expiresAt: Date;
}
