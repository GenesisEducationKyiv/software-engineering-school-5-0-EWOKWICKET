import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RootFilterQuery, Types } from 'mongoose';
import { MailSubjects } from 'src/common/constants/enums/mail-subjects.enum';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { Subscription, SubscriptionWithId } from 'src/database/schemas/subscription.schema';
import { NotificationsService, NotificationsServiceToken } from 'src/scheduler/interfaces/notifications-service.interface';
import { FindSubscriptionService } from 'src/scheduler/interfaces/subscription-service.interface';
import { SubscriptionRepository, SubscriptionRepositoryToken } from 'src/subscriptions/interfaces/subscription-repository.interface';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { ControllerSubscriptionService } from '../interfaces/subcription-service.interface';
import { CitiesWeatherService, CitiesWeatherServiceToken } from '../interfaces/weather-service.interface';

@Injectable()
export class SubscriptionService implements FindSubscriptionService, ControllerSubscriptionService {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepository: SubscriptionRepository,
    @Inject(NotificationsServiceToken)
    private readonly notificationsService: NotificationsService,
    @Inject(CitiesWeatherServiceToken)
    private readonly weatherService: CitiesWeatherService,
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
        token: newSubscription._id.toString(),
      },
      NotificationType.EMAIL,
    );
  }

  async confirm(token: string) {
    const objectId = this._transformId(token);
    const updated = await this.subscriptionRepository.updateById(objectId, { confirmed: true, expiresAt: null });
    if (!updated) throw new NotFoundException('Token Not Found');
  }

  async unsubscribe(token: string) {
    const objectId = this._transformId(token);
    const deleted = await this.subscriptionRepository.deleteById(objectId);
    if (!deleted) throw new NotFoundException('Token Not Found');
  }

  async find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]> {
    const found = await this.subscriptionRepository.find(options);
    return found;
  }

  private _transformId(token: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(token)) throw new NotFoundException('Token Not Found');
    return new Types.ObjectId(token);
  }
}
