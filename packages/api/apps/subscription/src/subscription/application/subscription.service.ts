import { NotificationSubjects } from '@common/contracts/notifications/constants/notification-subjects.enum';
import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { InvalidTokenException } from '@common/contracts/subscription/errors/invalid-token.error';
import { Injectable } from '@nestjs/common';
import { RootFilterQuery } from 'mongoose';
import { NotificationsClient } from 'src/common/clients/interfaces/notifications-client.interface';
import { Subscription } from '../domain/subscription.entity';
import { CreateSubscriptionDto } from '../presentation/dtos/create-subscription.dto';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from './interfaces/subcription-service.abstract';
import { ServiceSubscriptionRepository } from './interfaces/subscription-repository.abstract';

@Injectable()
export class SubscriptionService implements SubscriptionServiceLookup, SubscriptionServiceInterface {
  constructor(
    private readonly subscriptionRepository: ServiceSubscriptionRepository,
    private readonly notifications: NotificationsClient,
  ) {}

  async subscribe(subscribeDto: CreateSubscriptionDto): Promise<void> {
    const newSubscription = await this.subscriptionRepository.create(subscribeDto);

    await this.notifications.sendConfirmationNotification(
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

  async find(options: RootFilterQuery<Subscription>): Promise<Subscription[]> {
    const found = await this.subscriptionRepository.find(options);
    return found;
  }
}
