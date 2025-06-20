import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { NotificationsFrequencies } from '../../notifications/constants/enums/notification-frequencies.enum';

@Schema()
export class Subscription {
  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ required: true })
  city: string;

  @Prop({ type: String, enum: NotificationsFrequencies, required: true })
  frequency: NotificationsFrequencies;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ type: Date, default: null })
  expiresAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

export class SubscriptionWithId extends Subscription {
  _id: Types.ObjectId;
}
