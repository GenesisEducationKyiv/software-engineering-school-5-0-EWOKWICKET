import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SubscriptionClient } from '../application/interfaces/subscription-client.interface';
import { DtoRequestMapper } from '../application/mappers/dto-request.mapper';
import { CreateSubscriptionDto } from '../presentation/dtos/create-subscription.dto';

@Injectable()
export class SubscriptionGrpcClient implements SubscriptionClient {
  constructor(private readonly subscription) {}

  async subscribe(subscribeDto: CreateSubscriptionDto): Promise<void> {
    try {
      await lastValueFrom(this.subscription.subscribe(DtoRequestMapper.toEntity(subscribeDto)));
    } catch {
      throw new BadRequestException();
    }
  }

  async confirm(token: string): Promise<void> {
    await lastValueFrom(this.subscription.confirm({ token }));
  }

  async unsubscribe(token: string): Promise<void> {
    await lastValueFrom(this.subscription.unsubscribe({ token }));
  }
}
