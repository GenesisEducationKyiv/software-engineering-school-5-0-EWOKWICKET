import { Injectable } from '@nestjs/common';
import { SubscriptionServiceInterface } from 'src/subscription/application/interfaces/subcription-service.abstract';
import { GroupSubscriptionRepository } from 'src/subscription/application/interfaces/subscription-repository.abstract';
import { CreateSubscriptionDto } from 'src/subscription/presentation/dtos/create-subscription.dto';
import { SubscriptionFacadeInterface } from './interfaces/subscription-facade.interface';
import { Frequency } from 'src/subscription/domain/frequency.vo';

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
