import { RootFilterQuery, Types } from 'mongoose';
import { Subscription, SubscriptionWithId } from 'src/database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

export interface SubscriptionRepository {
  find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]>;
  create(createDto: CreateSubscriptionDto): Promise<SubscriptionWithId>;
  updateById(id: Types.ObjectId, updateDto: Partial<Subscription>): Promise<SubscriptionWithId | null>;
  deleteById(id: Types.ObjectId): Promise<SubscriptionWithId | null>;
}

export const SubscriptionRepositoryToken = 'SubscriptionRepository';
