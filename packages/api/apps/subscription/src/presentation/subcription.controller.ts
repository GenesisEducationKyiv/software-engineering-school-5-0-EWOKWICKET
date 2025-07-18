import { MongoIdValidationPipe } from '@common/pipes/mongo-id-validation.pipe';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateSubscriptionRequest, TokenRequest } from '@proto/subscription';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SubscriptionFacadeInterface } from 'src/facade/interfaces/subscription-facade.interface';
import { CreateSubscriptionDto } from 'src/subscription/presentation/dtos/create-subscription.dto';

@Controller()
export class SubscriptionController {
  constructor(private readonly facade: SubscriptionFacadeInterface) {}

  @GrpcMethod('SubscriptionService', 'subscribe')
  async subscribe(subscribeDto: CreateSubscriptionRequest): Promise<void> {
    const dto = plainToInstance(CreateSubscriptionDto, subscribeDto);
    await validateOrReject(dto);

    await this.facade.subscribe(subscribeDto);
  }

  @GrpcMethod('SubscriptionService', 'confirm')
  async confirm({ token }: TokenRequest): Promise<void> {
    await this.facade.confirm(new MongoIdValidationPipe().transform(token));
  }

  @GrpcMethod('SubscriptionService', 'unsubscribe')
  async unsubscribe({ token }: TokenRequest): Promise<void> {
    await this.facade.unsubscribe(new MongoIdValidationPipe().transform(token));
  }
}
