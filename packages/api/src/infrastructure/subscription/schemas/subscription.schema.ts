import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Frequency } from 'src/domain/subscription/valueObjects/frequency.vo';

@Schema()
export class Subscription {
  @Prop({ required: true, unique: false })
  email: string;

  @Prop({ required: true })
  city: string;

  @Prop({ type: String, enum: Frequency, required: true })
  frequency: Frequency;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ type: Date, default: null })
  expiresAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

export class SubscriptionWithId extends Subscription {
  _id: Types.ObjectId;
}

// SubscriptionSchema.index({ email: 1, city: 1 }, { unique: true });
// SubscriptionSchema.index({ expiresAt: 1 }, { expires: '1h' });
