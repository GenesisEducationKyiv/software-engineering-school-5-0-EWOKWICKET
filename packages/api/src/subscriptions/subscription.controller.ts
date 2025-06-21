import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { ControllerSubscriptionService } from './interfaces/subcription-service.interface';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(ControllerSubscriptionService)
    private readonly subscriptionService: ControllerSubscriptionService,
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
