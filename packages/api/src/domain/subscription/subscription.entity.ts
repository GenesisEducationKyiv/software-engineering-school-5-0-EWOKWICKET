import { Types } from 'mongoose';
import { Frequency } from './valueObjects/frequency.vo';

export interface SubscriptionEntity {
  _id: Types.ObjectId;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  expiresAt: Date;
}
