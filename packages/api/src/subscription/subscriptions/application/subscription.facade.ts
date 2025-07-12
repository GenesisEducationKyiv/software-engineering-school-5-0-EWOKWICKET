import { Injectable } from '@nestjs/common';
import { SubscriptionFacadeGroup, SubscriptionFacadePublic } from 'src/common/interfaces/subscription-facade.interface';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { CreateSubscriptionDto } from '../presentation/dtos/create-subscription.dto';
import { SubscriptionServiceInterface } from './interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository } from './interfaces/subscription-repository.abstract';

@Injectable()
export class SubscriptionFacade implements SubscriptionFacadeGroup, SubscriptionFacadePublic {
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
    await this.subscriptionRepository.findGroupedByCities(frequency);
  }
}
