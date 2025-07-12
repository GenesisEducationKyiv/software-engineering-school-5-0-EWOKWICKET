import { Injectable } from '@nestjs/common';
import { SubscriptionFacadePublic, SubscriptionFacadeRepository } from 'src/common/interfaces/subscription-facade.interface';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { SubscriptionServiceInterface } from '../subscriptions/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository } from '../subscriptions/application/interfaces/subscription-repository.abstract';
import { CreateSubscriptionDto } from '../subscriptions/presentation/dtos/create-subscription.dto';

@Injectable()
export class SubscriptionFacade implements SubscriptionFacadeRepository, SubscriptionFacadePublic {
  constructor(
    private readonly subscriptionRepository: GroupSubscriptionRepository,
    private readonly subscriptionService: SubscriptionServiceInterface,
  ) {}

  async subscribe(subscribeDto: CreateSubscriptionDto): Promise<void> {
    await this.subscriptionService.subscribe(subscribeDto);
  }

  async confirm(token: string): Promise<void> {
    await this.subscriptionService.confirm(token);
  }

  async unsubscribe(token: string): Promise<void> {
    await this.subscriptionService.unsubscribe(token);
  }

  async getGroupedSubscriptionsByFrequency(frequency: Frequency) {
    return await this.subscriptionRepository.findGroupedByCities(frequency);
  }
}
