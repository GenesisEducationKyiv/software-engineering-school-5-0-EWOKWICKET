import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { MailSubjects } from 'src/common/constants/enums/mail-subjects.enum';
import { MailSenderService } from 'src/notifications/mail/mail-sender.service';
import { WeatherService } from 'src/weather/services/weather.service';
import { Subscription } from '../../database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

//interface for SubscriptionRepository
export interface IServiceSubscriptionRepository {
  create(createDto: CreateSubscriptionDto);
  updateById(id: Types.ObjectId, updateDto: Partial<Subscription>);
  deleteById(id: Types.ObjectId);
}

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('IServiceSubscriptionRepository')
    private readonly subscriptionRepository: IServiceSubscriptionRepository,
    private readonly mailSenderService: MailSenderService,
    private readonly weatherService: WeatherService,
  ) {}

  async subscribe(subscribeDto: CreateSubscriptionDto): Promise<void> {
    const citiesFound = await this.weatherService.searchCities(subscribeDto.city);
    if (!citiesFound.includes(subscribeDto.city)) {
      throw new BadRequestException({
        message: 'No matching location found',
        possibleLocations: citiesFound,
      });
    }

    const newSubscription = await this.subscriptionRepository.create(subscribeDto);

    await this.mailSenderService.sendConfirmationEmail({
      to: newSubscription.email,
      subject: MailSubjects.SUBSCRIPTION_CONFIRMATION,
      token: newSubscription._id,
    });
  }

  async confirm(token: string) {
    //validation is in dto so can transform safely
    const objectId = new Types.ObjectId(token);
    const updated = await this.subscriptionRepository.updateById(objectId, { confirmed: true, expiresAt: null });
    if (!updated) throw new NotFoundException('Token Not Found');
  }

  async unsubscribe(token: string) {
    const objectId = new Types.ObjectId(token);
    const deleted = await this.subscriptionRepository.deleteById(objectId);
    if (!deleted) throw new NotFoundException('Token Not Found');
  }
}
