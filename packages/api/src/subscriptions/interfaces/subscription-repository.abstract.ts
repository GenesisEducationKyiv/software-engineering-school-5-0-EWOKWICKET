import { RootFilterQuery } from 'mongoose';
import { Subscription, SubscriptionWithId } from 'src/database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

export abstract class ServiceSubscriptionRepository {
  abstract find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]>;
  abstract create(createDto: CreateSubscriptionDto): Promise<SubscriptionWithId>;
  abstract updateById(id: string, updateDto: Partial<Subscription>): Promise<SubscriptionWithId | null>;
  abstract deleteById(id: string): Promise<SubscriptionWithId | null>;
}

export abstract class GroupSubscriptionRepository {
  abstract findGroupedByCities(frequency: string);
}
