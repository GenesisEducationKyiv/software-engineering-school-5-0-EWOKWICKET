import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateSubscriptionDto } from 'src/application/subscriptions/dtos/create-subscription.dto';
import { HOUR } from 'src/common/utils/time-units';
import { ServiceSubscriptionRepository } from 'src/domain/subscription/interfaces/subscription-repository.abstract';
import { SubscriptionEntity } from 'src/domain/subscription/subscription.entity';
import { SubscriptionEntityMapper } from '../mappers/subscription-entity.mapper';
import { Subscription } from '../schemas/subscription.schema';

@Injectable()
export class SubscriptionRepository implements ServiceSubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {}
  async find(options: RootFilterQuery<Subscription>): Promise<SubscriptionEntity[]> {
    const found = await this.subscriptionModel.find(options);
    return found.map(SubscriptionEntityMapper.toEntity);
  }

  async create(createDto: CreateSubscriptionDto): Promise<SubscriptionEntity> {
    const newSubscription = new this.subscriptionModel({
      ...createDto,
      expiresAt: new Date(Date.now() + HOUR),
    });

    const savedSubscription = await newSubscription.save();
    return SubscriptionEntityMapper.toEntity(savedSubscription);
  }

  async updateById(id: string, updateDto: Partial<Subscription>): Promise<SubscriptionEntity | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateDto).exec();
    return SubscriptionEntityMapper.toEntity(updated);
  }

  async deleteById(id: string): Promise<SubscriptionEntity | null> {
    const deleted = await this.subscriptionModel.findByIdAndDelete(id).exec();
    return SubscriptionEntityMapper.toEntity(deleted);
  }

  async findGroupedByCities(frequency: string) {
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
