import { RootFilterQuery } from 'mongoose';
import { Subscription } from 'src/domain/subscription/subscription.entity';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

export abstract class ServiceSubscriptionRepository {
  abstract find(options: RootFilterQuery<Subscription>): Promise<Subscription[]>;
  abstract create(createDto: CreateSubscriptionDto): Promise<Subscription>;
  abstract updateById(id: string, updateDto: Partial<Subscription>): Promise<Subscription | null>;
  abstract deleteById(id: string): Promise<Subscription | null>;
}

export abstract class GroupSubscriptionRepository {
  abstract findGroupedByCities(frequency: string);
}
