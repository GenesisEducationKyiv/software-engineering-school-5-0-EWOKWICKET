import { Types } from 'mongoose';
import { ISubscription } from 'src/common/constants/types/subscription.interface';
import { Subscription } from 'src/database/schemas/subscription.schema';
import { ISubscriptionService } from 'src/scheduler/interfaces/subscription-service.interface';
import { CreateSubscriptionDto } from 'src/subscriptions/dtos/create-subscription.dto';

export interface ISubscriptionRepository extends ISubscriptionService {
  create(createDto: CreateSubscriptionDto): Promise<ISubscription>;
  updateById(id: Types.ObjectId, updateDto: Partial<Subscription>): Promise<ISubscription | null>;
  deleteById(id: Types.ObjectId): Promise<ISubscription | null>;
}

export const SubscriptionRepositoryToken = 'SubscriptionRepository';
