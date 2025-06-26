import { Inject, Injectable } from '@nestjs/common';
import { RootFilterQuery } from 'mongoose';
import { Subscription, SubscriptionWithId } from 'src/database/schemas/subscription.schema';
import { NotificationsServiceInterface } from 'src/notifications/abstractions/notifications-service.abstract';
import { NotificationSubjects } from 'src/notifications/constants/enums/notification-subjects.enum';
import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { ControllerSubscriptionService, FindSubscriptionService } from '../abstractions/subcription-service.abstract';
import { ServiceSubscriptionRepository } from '../abstractions/subscription-repository.abstract';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { InvalidTokenException } from '../errors/invalid-token.error';

@Injectable()
export class SubscriptionService implements FindSubscriptionService, ControllerSubscriptionService {
  constructor(
    @Inject(ServiceSubscriptionRepository)
    private readonly subscriptionRepository: ServiceSubscriptionRepository,
    @Inject(NotificationsServiceInterface)
    private readonly notificationsService: NotificationsServiceInterface,
  ) {}

  async subscribe(subscribeDto: CreateSubscriptionDto): Promise<void> {
    const newSubscription = await this.subscriptionRepository.create(subscribeDto);

    await this.notificationsService.sendConfirmationNotification(
      {
        to: newSubscription.email,
        subject: `${NotificationSubjects.SUBSCRIPTION_CONFIRMATION} ${newSubscription.city}`,
        token: newSubscription._id.toString(),
      },
      NotificationType.EMAIL,
    );
  }

  async confirm(token: string) {
    const updateObject = { confirmed: true, expiresAt: null };
    const updated = await this.subscriptionRepository.updateById(token, updateObject);
    if (!updated) throw new InvalidTokenException('Token Not Found');
  }

  async unsubscribe(token: string) {
    const deleted = await this.subscriptionRepository.deleteById(token);
    if (!deleted) throw new InvalidTokenException('Token Not Found');
  }

  async find(options: RootFilterQuery<Subscription>): Promise<SubscriptionWithId[]> {
    const found = await this.subscriptionRepository.find(options);
    return found;
  }
}
