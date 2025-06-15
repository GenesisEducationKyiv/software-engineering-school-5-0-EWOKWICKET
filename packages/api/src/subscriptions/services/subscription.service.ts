import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RootFilterQuery, Types } from 'mongoose';
import { MailSubjects } from 'src/common/constants/enums/mail-subjects.enum';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { ISubscription } from 'src/common/constants/types/subscription.interface';
import { Subscription } from 'src/database/schemas/subscription.schema';
import { INotificationsService, NotificationsServiceToken } from 'src/scheduler/interfaces/notifications-service.interface';
import { ISchedulerSubscriptionService } from 'src/scheduler/interfaces/subscription-service.interface';
import { ISubscriptionRepository, SubscriptionRepositoryToken } from 'src/subscriptions/interfaces/subscription-repository.interface';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { IControllerSubscriptionService } from '../interfaces/subcription-service.interface';
import { ICitiesWeatherService, CitiesWeatherServiceToken } from '../interfaces/weather-service.interface';

@Injectable()
export class SubscriptionService implements ISchedulerSubscriptionService, IControllerSubscriptionService {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(NotificationsServiceToken)
    private readonly notificationsService: INotificationsService,
    @Inject(CitiesWeatherServiceToken)
    private readonly weatherService: ICitiesWeatherService,
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
