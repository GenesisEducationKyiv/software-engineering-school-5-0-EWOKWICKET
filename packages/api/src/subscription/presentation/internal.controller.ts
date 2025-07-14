import { Controller, Get, Query } from '@nestjs/common';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { SubscriptionFacadeRepository } from 'src/subscription/application/interfaces/subscription-facade.interface';

@Controller('subscription/internal')
export class InternalSubscriptionController {
  constructor(private readonly facade: SubscriptionFacadeRepository) {}

  @Get('groupedSubscription')
  async getGroupedSubscriptionsByFrequency(@Query('frequency') frequency: Frequency) {
    return await this.facade.getGroupedSubscriptionsByFrequency(frequency);
  }
}
