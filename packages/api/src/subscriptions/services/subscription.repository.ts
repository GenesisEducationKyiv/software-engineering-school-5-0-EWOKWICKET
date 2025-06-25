import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { ServiceSubscriptionRepository } from 'src/subscriptions/abstractions/subscription-repository.abstract';
import { HOUR } from 'src/utils/time-units';
import { Subscription, SubscriptionWithId } from '../../database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

@Injectable()
export class SubscriptionRepository implements ServiceSubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {}
  async find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]> {
    const found = await this.subscriptionModel.find(options);
    return found;
  }

  async create(createDto: CreateSubscriptionDto): Promise<SubscriptionWithId> {
    const newSubscription = new this.subscriptionModel({
      ...createDto,
      expiresAt: new Date(Date.now() + HOUR),
    });

    const savedSubscription = await newSubscription.save();
    return savedSubscription;
  }

  async updateById(id: string, updateDto: Partial<Subscription>): Promise<SubscriptionWithId | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateDto).exec();
    return updated;
  }

  async deleteById(id: string): Promise<SubscriptionWithId | null> {
    const deleted = await this.subscriptionModel.findByIdAndDelete(id).exec();
    return deleted;
  }

  async findGroupedByCities(frequency: string) {
    return this.subscriptionModel.aggregate([
      { $match: { frequency: frequency, confirmed: true } },
      {
        $group: {
          _id: '$city',
          subscriptions: { $push: '$$ROOT' },
        },
      },
    ]);
  }
}
