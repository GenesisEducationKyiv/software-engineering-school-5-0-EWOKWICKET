import { NotificationSubjects } from '@common/contracts/notifications/constants/notification-subjects.enum';
import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { InvalidTokenException } from '@common/contracts/subscription/errors/invalid-token.error';
import { LoggerInterface } from '@logger/application/interfaces/logger.interface';
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
    private readonly logger: LoggerInterface,
  ) {}

  async subscribe(subscribeDto: CreateSubscriptionDto): Promise<void> {
    const newSubscription = await this.subscriptionRepository.create(subscribeDto);
    await this.notifications.sendConfirmationNotification(
      {
        to: newSubscription.email,
        subject: NotificationSubjects.SUBSCRIPTION_CONFIRMATION,
        token: newSubscription._id,
      },
      NotificationType.EMAIL,
    );

    this.logger.info('Subscription created', {
      data: {
        id: newSubscription._id,
        city: newSubscription.city,
        frequency: newSubscription.frequency,
      },
      labels: { action: 'database' },
    });
  }

  async confirm(token: string) {
    const updateObject = { confirmed: true, expiresAt: null };
    const updated = await this.subscriptionRepository.updateById(token, updateObject);
    if (!updated) throw new InvalidTokenException('Token Not Found');

    this.logger.info('Subscription confirmed', {
      data: {
        id: updated._id,
        city: updated.city,
        frequency: updated.frequency,
      },
    });
  }

  async unsubscribe(token: string) {
    const deleted = await this.subscriptionRepository.deleteById(token);
    if (!deleted) throw new InvalidTokenException('Token Not Found');

    this.logger.info('Subscription deleteed', {
      data: {
        id: deleted._id,
        city: deleted.city,
        frequency: deleted.frequency,
      },
    });
  }

  async find(options: RootFilterQuery<Subscription>): Promise<Subscription[]> {
    const found = await this.subscriptionRepository.find(options);
    return found;
  }
}
