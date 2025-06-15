import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, RootFilterQuery, Types } from 'mongoose';
import { ISubscription } from 'src/common/constants/types/subscription.interface';
import { IWeatherSubscriptionRepository } from 'src/scheduler/interfaces/subscription-repository.interface';
import { IServiceSubscriptionRepository } from 'src/weather/interfaces/subscription-repository.interface';
import { Subscription } from '../../database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

@Injectable()
export class SubscriptionRepository implements IServiceSubscriptionRepository, IWeatherSubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {}
  async find(options: RootFilterQuery<Subscription>): Promise<HydratedDocument<Subscription>[]> {
    const found = await this.subscriptionModel.find(options);
    return found;
  }

  async create(createDto: CreateSubscriptionDto): Promise<ISubscription> {
    const newSubscription = new this.subscriptionModel({
      ...createDto,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const savedSubscription = await newSubscription.save();
    return savedSubscription;
  }

  async updateById(id: Types.ObjectId, updateDto: Partial<Subscription>): Promise<ISubscription | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateDto).exec();
    return updated;
  }

  async deleteById(id: Types.ObjectId): Promise<ISubscription | null> {
    const deleted = await this.subscriptionModel.findByIdAndDelete(id).exec();
    return deleted;
  }
}
