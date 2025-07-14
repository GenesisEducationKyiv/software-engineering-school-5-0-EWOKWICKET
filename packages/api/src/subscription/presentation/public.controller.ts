import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubscriptionFacadePublic } from '../application/interfaces/subscription-facade.interface';
import { CreateSubscriptionDto } from '../subscription-domain/presentation/dtos/create-subscription.dto';

@Controller('subscription')
export class PublicSubscriptionController {
  constructor(private readonly facade: SubscriptionFacadePublic) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeDto: CreateSubscriptionDto) {
    await this.facade.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    await this.facade.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    await this.facade.unsubscribe(token);
  }
}
