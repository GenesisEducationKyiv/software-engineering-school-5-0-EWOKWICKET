import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { TokenDto } from './dtos/token.dto';
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
  confirm(@Param('token') tokenDto: TokenDto) {
    return this.subscriptionService.confirm(tokenDto.token);
  }

  @Get('unsubscribe/:token')
  unsubscribe(@Param('token') tokenDto: TokenDto) {
    return this.subscriptionService.unsubscribe(tokenDto.token);
  }
}
