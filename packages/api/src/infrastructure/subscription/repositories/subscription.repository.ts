import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateSubscriptionDto } from 'src/application/subscriptions/dtos/create-subscription.dto';
import { HOUR } from 'src/common/utils/time-units';
import { ServiceSubscriptionRepository } from 'src/domain/subscription/services/subscription-repository.abstract';
import { Subscription } from '../schemas/subscription.schema';

@Injectable()
export class SubscriptionRepository implements ServiceSubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {}
  async find(options: RootFilterQuery<Subscription>): Promise<Subscription[]> {
    const found = await this.subscriptionModel.find(options);
    return found;
  }

  async create(createDto: CreateSubscriptionDto): Promise<Subscription> {
    const newSubscription = new this.subscriptionModel({
      ...createDto,
      expiresAt: new Date(Date.now() + HOUR),
    });

    const savedSubscription = await newSubscription.save();
    return savedSubscription;
  }

  async updateById(id: string, updateDto: Partial<Subscription>): Promise<Subscription | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateDto).exec();
    return updated;
  }

  async deleteById(id: string): Promise<Subscription | null> {
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
