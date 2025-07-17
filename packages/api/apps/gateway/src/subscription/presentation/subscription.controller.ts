import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { SubscriptionClient } from '../application/interfaces/subscription-client.interface';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscription: SubscriptionClient) {}

  @HttpCode(200)
  @Post('subscribe')
  async subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    await this.subscription.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    await this.subscription.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    await this.subscription.unsubscribe(token);
  }
}
