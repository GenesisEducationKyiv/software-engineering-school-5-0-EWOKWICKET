import { RootFilterQuery } from 'mongoose';
import { Subscription } from 'src/infrastructure/subscription/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../../../application/subscriptions/dtos/create-subscription.dto';
import { SubscriptionEntity } from '../subscription.entity';

export abstract class ServiceSubscriptionRepository {
  abstract find(options: RootFilterQuery<Subscription>): Promise<SubscriptionEntity[]>;
  abstract create(createDto: CreateSubscriptionDto): Promise<SubscriptionEntity>;
  abstract updateById(id: string, updateDto: Partial<Subscription>): Promise<SubscriptionEntity | null>;
  abstract deleteById(id: string): Promise<SubscriptionEntity | null>;
}

export abstract class GroupSubscriptionRepository {
  abstract findGroupedByCities(frequency: string);
}
