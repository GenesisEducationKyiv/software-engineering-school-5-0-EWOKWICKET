import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SubscriptionEntity } from 'src/domain/subscription/subscription.entity';
import { Frequency } from 'src/domain/subscription/valueObjects/frequency.vo';

@Schema()
export class Subscription implements SubscriptionEntity {
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
