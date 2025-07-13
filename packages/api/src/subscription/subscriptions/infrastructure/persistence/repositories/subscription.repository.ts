import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { HOUR } from 'src/common/utils/time-units';
import { CreateSubscriptionDto } from 'src/gateway/subscription/dtos/create-subscription.dto';
import { ServiceSubscriptionRepository } from '../../../application/interfaces/subscription-repository.abstract';
import { Subscription } from '../../../domain/subscription.entity';
import { SubscriptionEntityMapper } from '../../mappers/subscription-entity.mapper';

@Injectable()
export class SubscriptionRepository implements ServiceSubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {}
  async find(options: RootFilterQuery<Subscription>): Promise<Subscription[]> {
    const found = await this.subscriptionModel.find(options);
    return found.map(SubscriptionEntityMapper.toEntity);
  }

  async create(createDto: CreateSubscriptionDto): Promise<Subscription> {
    const newSubscription = new this.subscriptionModel({
      ...createDto,
      expiresAt: new Date(Date.now() + HOUR),
    });

    const savedSubscription = await newSubscription.save();
    return SubscriptionEntityMapper.toEntity(savedSubscription);
  }

  async updateById(id: string, updateDto: Partial<Subscription>): Promise<Subscription | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateDto).exec();
    if (!updated) return null;
    return SubscriptionEntityMapper.toEntity(updated);
  }

  async deleteById(id: string): Promise<Subscription | null> {
    const deleted = await this.subscriptionModel.findByIdAndDelete(id).exec();
    if (!deleted) return null;
    return SubscriptionEntityMapper.toEntity(deleted);
  }

  async findGroupedByCities(frequency: Frequency) {
    const rawGroup = await this.subscriptionModel.aggregate([
      { $match: { frequency: frequency, confirmed: true } },
      {
        $group: {
          _id: '$city',
          subscriptions: { $push: '$$ROOT' },
        },
      },
    ]);

    return rawGroup.map((group) => ({
      city: group._id,
      subscriptions: group.subscriptions.map(SubscriptionEntityMapper.toEntity),
    }));
  }
}
