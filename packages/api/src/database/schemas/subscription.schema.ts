import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';

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
