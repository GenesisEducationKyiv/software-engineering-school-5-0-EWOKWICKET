import { RootFilterQuery } from 'mongoose';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { CreateSubscriptionDto } from 'src/gateway/subscription/dtos/create-subscription.dto';
import { Subscription } from '../../domain/subscription.entity';

export abstract class ServiceSubscriptionRepository {
  abstract find(options: RootFilterQuery<Subscription>): Promise<Subscription[]>;
  abstract create(createDto: CreateSubscriptionDto): Promise<Subscription>;
  abstract updateById(id: string, updateDto: Partial<Subscription>): Promise<Subscription | null>;
  abstract deleteById(id: string): Promise<Subscription | null>;
}

export abstract class GroupSubscriptionRepository {
  abstract findGroupedByCities(frequency: Frequency);
}
