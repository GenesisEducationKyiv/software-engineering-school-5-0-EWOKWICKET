import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { WeatherService } from 'src/weather/services/weather.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { Subscription } from './schemas/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    private readonly mailService: MailService,
    private readonly weatherService: WeatherService,
  ) {}

  async subscribe(subscribeDto: CreateSubscriptionDto) {
    const citiesFound = await this.weatherService.searchCities(subscribeDto.city);
    if (!citiesFound.includes(subscribeDto.city)) {
      throw new BadRequestException({
        message: 'No matching location found',
        possibleLocations: citiesFound,
      });
    }

    const subscription = new this.subscriptionModel({
      ...subscribeDto,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    try {
      const savedSubscription = await subscription.save();
      await this.mailService.sendConfirmationEmail({
        to: savedSubscription.email,
        subject: 'Confirm subscription',
        token: savedSubscription._id,
      });
      return;
    } catch (err) {
      if (subscription._id) await this.subscriptionModel.findByIdAndDelete(subscription._id);

      if (err.code === 11000) throw new ConflictException('Email already subscribed');
      else throw err;
    }
  }

  async confirm(token: string) {
    if (!Types.ObjectId.isValid(token)) throw new NotFoundException('Token Not Found');

    const updated = await this.subscriptionModel.findByIdAndUpdate(token, { confirmed: true, expiresAt: null }).exec();
    if (!updated) throw new NotFoundException('Token Not Found');
  }

  async unsubscribe(token: string) {
    if (!Types.ObjectId.isValid(token)) throw new NotFoundException('Token Not Found');

    const deleted = await this.subscriptionModel.findByIdAndDelete(token).exec();
    if (!deleted) throw new NotFoundException('Token Not Found');
  }
}
