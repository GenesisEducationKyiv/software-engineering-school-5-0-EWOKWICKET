import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from 'src/application/subscriptions/dtos/create-subscription.dto';
import { SubscriptionServiceInterface } from 'src/application/subscriptions/interfaces/subcription-service.abstract';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(SubscriptionServiceInterface)
    private readonly subscriptionService: SubscriptionServiceInterface,
  ) {}

  @HttpCode(200)
  @Post('subscribe')
  async subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    await this.subscriptionService.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  async confirm(@Param('token', MongoIdValidationPipe) token: string) {
    await this.subscriptionService.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token', MongoIdValidationPipe) token: string) {
    await this.subscriptionService.unsubscribe(token);
  }
}
