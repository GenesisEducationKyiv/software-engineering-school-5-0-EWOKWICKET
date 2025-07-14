import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { SubscriptionClient } from '../application/interfaces/subscription-client.interface';

@Controller('weatherapi.app/api')
export class SubscriptionController {
  constructor(private readonly subscription: SubscriptionClient) {}

  @HttpCode(200)
  @Post('subscribe')
  async subscribe(@Body() subscribeDto: unknown) {
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
