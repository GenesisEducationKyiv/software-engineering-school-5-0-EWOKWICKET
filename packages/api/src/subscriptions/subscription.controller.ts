import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { ControllerSubscriptionServiceToken, IControllerSubscriptionService } from './interfaces/subcription-service.interface';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(ControllerSubscriptionServiceToken)
    private readonly subscriptionService: IControllerSubscriptionService,
  ) {}

  //validates globally
  @HttpCode(200)
  @Post('subscribe')
  async subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    await this.subscriptionService.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    await this.subscriptionService.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    await this.subscriptionService.unsubscribe(token);
  }
}
