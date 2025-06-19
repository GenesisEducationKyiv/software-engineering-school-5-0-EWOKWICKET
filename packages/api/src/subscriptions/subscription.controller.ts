import { Body, Controller, Get, HttpCode, Inject, Param, Post, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { ControllerSubscriptionService, ControllerSubscriptionServiceToken } from './interfaces/subcription-service.interface';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(ControllerSubscriptionServiceToken)
    private readonly subscriptionService: ControllerSubscriptionService,
  ) {}

  @UsePipes(CityValidationPipe)
  @HttpCode(200)
  @Post('subscribe')
  subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    this.subscriptionService.subscribe(subscribeDto);
  }

  @UsePipes(MongoIdValidationPipe)
  @Get('confirm/:token')
  confirm(@Param('token') token: string) {
    this.subscriptionService.confirm(token);
  }

  @UsePipes(MongoIdValidationPipe)
  @Get('unsubscribe/:token')
  unsubscribe(@Param('token') token: string) {
    this.subscriptionService.unsubscribe(token);
  }
}
