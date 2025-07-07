import { Injectable } from '@nestjs/common';
import { RootFilterQuery } from 'mongoose';
import { NotificationSubjects } from 'src/application/notifications/constants/enums/notification-subjects.enum';
import { NotificationType } from 'src/application/notifications/constants/enums/notification-type.enum';
import { NotificationsServiceInterface } from 'src/domain/notifications/notifications-service.abstract';
import { InvalidTokenException } from 'src/domain/subscription/errors/invalid-token.error';
import { SubscriptionServiceInterface, SubscriptionServiceLookup } from 'src/domain/subscription/interfaces/subcription-service.abstract';
import { ServiceSubscriptionRepository } from 'src/domain/subscription/interfaces/subscription-repository.abstract';
import { Subscription } from 'src/infrastructure/subscription/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { SubscriptionEntity } from 'src/domain/subscription/subscription.entity';

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

  async find(options: RootFilterQuery<Subscription>): Promise<SubscriptionEntity[]> {
    const found = await this.subscriptionRepository.find(options);
    return found;
  }
}
