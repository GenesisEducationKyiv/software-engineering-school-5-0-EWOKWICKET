import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { SubscriptionService } from './services/subscription.service';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  //validates globally
  @HttpCode(200)
  @Post('subscribe')
  async subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    await this.subscriptionService.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  confirm(@Param('token') token: string) {
    return this.subscriptionService.confirm(token);
  }

  @Get('unsubscribe/:token')
  unsubscribe(@Param('token') token: string) {
    return this.subscriptionService.unsubscribe(token);
  }
}
