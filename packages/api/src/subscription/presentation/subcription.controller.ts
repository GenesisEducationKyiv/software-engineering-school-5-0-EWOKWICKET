import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { SubscriptionFacadeInterface } from '../facade/interfaces/subscription-facade.interface';
import { CreateSubscriptionDto } from '../subscription-domain/presentation/dtos/create-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly facade: SubscriptionFacadeInterface) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    await this.facade.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    await this.facade.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    await this.facade.unsubscribe(token);
  }

  @Get('groupedSubscription')
  async getGroupedSubscriptionsByFrequency(@Query('frequency') frequency: Frequency) {
    return await this.facade.getGroupedSubscriptionsByFrequency(frequency);
  }
}
