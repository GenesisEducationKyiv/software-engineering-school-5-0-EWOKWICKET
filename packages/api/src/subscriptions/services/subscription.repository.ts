import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { SubscriptionRepository as SubscriptionRepositoryInterface } from 'src/subscriptions/interfaces/subscription-repository.interface';
import { Subscription, SubscriptionWithId } from '../../database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

@Injectable()
export class SubscriptionRepository implements SubscriptionRepositoryInterface {
  constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {}
  async find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]> {
    const found = await this.subscriptionModel.find(options);
    return found;
  }

  async create(createDto: CreateSubscriptionDto): Promise<SubscriptionWithId> {
    const newSubscription = new this.subscriptionModel({
      ...createDto,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const savedSubscription = await newSubscription.save();
    return savedSubscription;
  }

  async updateById(id: Types.ObjectId, updateDto: Partial<Subscription>): Promise<SubscriptionWithId | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateDto).exec();
    return updated;
  }

  async deleteById(id: Types.ObjectId): Promise<SubscriptionWithId | null> {
    const deleted = await this.subscriptionModel.findByIdAndDelete(id).exec();
    return deleted;
  }
}
