import { RootFilterQuery } from 'mongoose';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { Subscription } from '../../domain/subscription.entity';
import { CreateSubscriptionDto } from '../../presentation/dtos/create-subscription.dto';

export abstract class ServiceSubscriptionRepository {
  abstract find(options: RootFilterQuery<Subscription>): Promise<Subscription[]>;
  abstract create(createDto: CreateSubscriptionDto): Promise<Subscription>;
  abstract updateById(id: string, updateDto: Partial<Subscription>): Promise<Subscription | null>;
  abstract deleteById(id: string): Promise<Subscription | null>;
}

export abstract class GroupSubscriptionRepository {
  abstract findGroupedByCities(frequency: Frequency);
}
