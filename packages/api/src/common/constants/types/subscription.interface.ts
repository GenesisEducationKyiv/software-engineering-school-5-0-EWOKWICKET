import { Types } from 'mongoose';
import { Subscription } from 'src/database/schemas/subscription.schema';

export class ISubscription extends Subscription {
  _id: Types.ObjectId;
}
