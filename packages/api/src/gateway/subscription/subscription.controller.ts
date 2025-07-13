import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { SubscriptionFacadePublic } from 'src/common/interfaces/subscription-facade.interface';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscription: SubscriptionFacadePublic) {}

  @HttpCode(200)
  @Post('subscribe')
  async subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    await this.subscription.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  async confirm(@Param('token', MongoIdValidationPipe) token: string) {
    await this.subscription.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token', MongoIdValidationPipe) token: string) {
    await this.subscription.unsubscribe(token);
  }
}
