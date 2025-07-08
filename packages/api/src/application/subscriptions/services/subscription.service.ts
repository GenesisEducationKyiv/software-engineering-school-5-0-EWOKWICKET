import { Injectable } from '@nestjs/common';
import { RootFilterQuery } from 'mongoose';
import { NotificationSubjects } from 'src/application/notifications/constants/notification-subjects.enum';
import { NotificationType } from 'src/application/notifications/constants/notification-type.enum';
import { NotificationsServiceInterface } from 'src/application/notifications/interfaces/notifications-service.abstract';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from 'src/application/subscriptions/interfaces/subcription-service.abstract';
import { ServiceSubscriptionRepository } from 'src/application/subscriptions/interfaces/subscription-repository.abstract';
import { InvalidTokenException } from 'src/domain/subscription/errors/invalid-token.error';
import { Subscription } from 'src/domain/subscription/subscription.entity';
import { CreateSubscriptionDto } from '../../../presentation/subscription/dtos/create-subscription.dto';

@Injectable()
export class SubscriptionService implements SubscriptionServiceLookup, SubscriptionServiceInterface {
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

  async find(options: RootFilterQuery<Subscription>): Promise<Subscription[]> {
    const found = await this.subscriptionRepository.find(options);
    return found;
  }
}
