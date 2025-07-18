import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SubscriptionClient } from '../application/interfaces/subscription-client.interface';
import { DtoRequestMapper } from '../application/mappers/dto-request.mapper';
import { CreateSubscriptionDto } from '../presentation/dtos/create-subscription.dto';

@Injectable()
export class SubscriptionGrpcClient implements SubscriptionClient, OnModuleInit {
  private subscription;

  constructor(@Inject('SUBSCRIPTION') private readonly subscriptionClient: ClientGrpc) {}

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

  onModuleInit() {
    this.subscription = this.subscriptionClient.getService('SubscriptionService');
  }
}
