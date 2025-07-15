import { Frequency } from '@common/contracts/subscription/domain/frequency.vo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Subscription {
  _id: Types.ObjectId;

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
