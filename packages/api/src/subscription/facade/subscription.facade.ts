import { Injectable } from '@nestjs/common';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { SubscriptionServiceInterface } from '../subscription-domain/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository } from '../subscription-domain/application/interfaces/subscription-repository.abstract';
import { CreateSubscriptionDto } from '../subscription-domain/presentation/dtos/create-subscription.dto';
import { SubscriptionFacadeInterface } from './interfaces/subscription-facade.interface';

@Injectable()
export class SubscriptionFacade implements SubscriptionFacadeInterface {
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
