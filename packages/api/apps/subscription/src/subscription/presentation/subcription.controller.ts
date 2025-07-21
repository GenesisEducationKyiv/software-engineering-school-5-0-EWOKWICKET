import { GrpcServices } from '@common/configs/services';
import { MongoIdValidationPipe } from '@common/pipes/mongo-id-validation.pipe';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateSubscriptionRequest, TokenRequest } from '@proto/subscription';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateSubscriptionDto } from 'src/subscription/presentation/dtos/create-subscription.dto';
import { SubscriptionServiceInterface } from '../application/interfaces/subcription-service.abstract';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionServiceInterface) {}

  @GrpcMethod(GrpcServices.SUBSCRIPTION.name, GrpcServices.SUBSCRIPTION.endpoints.subscribe)
  async subscribe(subscribeDto: CreateSubscriptionRequest): Promise<void> {
    const dto = plainToInstance(CreateSubscriptionDto, subscribeDto);
    await validateOrReject(dto);

    await this.subscriptionService.subscribe(dto);
  }

  @GrpcMethod(GrpcServices.SUBSCRIPTION.name, GrpcServices.SUBSCRIPTION.endpoints.confirm)
  async confirm({ token }: TokenRequest): Promise<void> {
    await this.subscriptionService.confirm(new MongoIdValidationPipe().transform(token));
  }

  @GrpcMethod(GrpcServices.SUBSCRIPTION.name, GrpcServices.SUBSCRIPTION.endpoints.unsubscribe)
  async unsubscribe({ token }: TokenRequest): Promise<void> {
    await this.subscriptionService.unsubscribe(new MongoIdValidationPipe().transform(token));
  }
}
