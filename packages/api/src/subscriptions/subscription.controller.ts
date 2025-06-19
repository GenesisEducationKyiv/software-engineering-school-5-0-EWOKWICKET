import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { ControllerSubscriptionService, ControllerSubscriptionServiceToken } from './interfaces/subcription-service.interface';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(ControllerSubscriptionServiceToken)
    private readonly subscriptionService: ControllerSubscriptionService,
  ) {}

  @HttpCode(200)
  @Post('subscribe')
  subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    this.subscriptionService.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  confirm(@Param('token', MongoIdValidationPipe) token: string) {
    this.subscriptionService.confirm(token);
  }

  @Get('unsubscribe/:token')
  unsubscribe(@Param('token', MongoIdValidationPipe) token: string) {
    this.subscriptionService.unsubscribe(token);
  }
}
