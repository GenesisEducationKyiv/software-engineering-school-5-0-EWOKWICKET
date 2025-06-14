import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, RootFilterQuery, Types } from 'mongoose';
import { IWeatherSubscriptionRepository } from 'src/scheduler/weather/weather-scheduler.service';
import { Subscription } from '../../database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { IServiceSubscriptionRepository } from './subscription.service';

@Injectable()
export class SubscriptionRepository implements IServiceSubscriptionRepository, IWeatherSubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>) {}
  async find(options: RootFilterQuery<Subscription>) {
    const found = await this.subscriptionModel.find(options);
    return found;
  }

  async create(createDto: CreateSubscriptionDto): Promise<HydratedDocument<Subscription>> {
    const newSubscription = new this.subscriptionModel({
      ...createDto,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const savedSubscription = await newSubscription.save();
    return savedSubscription;
  }

  async updateById(id: Types.ObjectId, updateDto: Partial<Subscription>): Promise<HydratedDocument<Subscription>> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateDto).exec();
    return updated;
  }

  async deleteById(id: Types.ObjectId): Promise<HydratedDocument<Subscription>> {
    const deleted = await this.subscriptionModel.findByIdAndDelete(id).exec();
    return deleted;
  }
}
