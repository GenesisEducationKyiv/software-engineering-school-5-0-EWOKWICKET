import { Injectable } from '@nestjs/common';
import { RootFilterQuery } from 'mongoose';
import { Subscription, SubscriptionWithId } from 'src/database/schemas/subscription.schema';
import { NotificationSubjects } from 'src/notifications/constants/enums/notification-subjects.enum';
import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { NotificationsServiceInterface } from 'src/notifications/interfaces/notifications-service.abstract';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { InvalidTokenException } from '../errors/invalid-token.error';
import { ControllerSubscriptionService, FindSubscriptionService } from '../interfaces/subcription-service.abstract';
import { ServiceSubscriptionRepository } from '../interfaces/subscription-repository.abstract';

@Injectable()
export class SubscriptionService implements FindSubscriptionService, ControllerSubscriptionService {
  constructor(
    private readonly subscriptionRepository: ServiceSubscriptionRepository,
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
