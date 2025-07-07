import { RootFilterQuery } from 'mongoose';
import { SubscriptionDb } from 'src/infrastructure/subscription/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../../../application/subscriptions/dtos/create-subscription.dto';
import { Subscription } from '../subscription.entity';

export abstract class ServiceSubscriptionRepository {
  abstract find(options: RootFilterQuery<SubscriptionDb>): Promise<Subscription[]>;
  abstract create(createDto: CreateSubscriptionDto): Promise<Subscription>;
  abstract updateById(id: string, updateDto: Partial<SubscriptionDb>): Promise<Subscription | null>;
  abstract deleteById(id: string): Promise<Subscription | null>;
}

export abstract class GroupSubscriptionRepository {
  abstract findGroupedByCities(frequency: string);
}
