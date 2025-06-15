import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RootFilterQuery, Types } from 'mongoose';
import { Subscription } from 'rxjs';
import { MailSubjects } from 'src/common/constants/enums/mail-subjects.enum';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { ISubscription } from 'src/common/constants/types/subscription.interface';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ISubscriptionRepository, SubscriptionRepositoryToken } from 'src/subscriptions/interfaces/subscription-repository.interface';
import { WeatherService } from 'src/weather/services/weather.service';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly notificationsService: NotificationsService,
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

    await this.notificationsService.sendConfirmationNotification(
      {
        to: newSubscription.email,
        subject: MailSubjects.SUBSCRIPTION_CONFIRMATION,
        token: newSubscription._id,
      },
      NotificationType.EMAIL,
    );
  }

  async confirm(token: string) {
    if (!Types.ObjectId.isValid(token)) throw new NotFoundException('Token Not Found');

    const objectId = new Types.ObjectId(token);
    const updated = await this.subscriptionRepository.updateById(objectId, { confirmed: true, expiresAt: null });
    if (!updated) throw new NotFoundException('Token Not Found');
  }

  async unsubscribe(token: string) {
    if (!Types.ObjectId.isValid(token)) throw new NotFoundException('Token Not Found');

    const objectId = new Types.ObjectId(token);
    const deleted = await this.subscriptionRepository.deleteById(objectId);
    if (!deleted) throw new NotFoundException('Token Not Found');
  }

  async find(options: RootFilterQuery<Subscription>): Promise<ISubscription[]> {
    const found = await this.subscriptionRepository.find(options);
    return found;
  }
}
