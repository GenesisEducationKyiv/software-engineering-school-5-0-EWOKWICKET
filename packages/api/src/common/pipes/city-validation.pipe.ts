import { Injectable, PipeTransform } from '@nestjs/common';
import { CityValidationService } from 'src/city/city-validation.service';
import { CreateSubscriptionDto } from 'src/subscriptions/dtos/create-subscription.dto';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly cityValidation: CityValidationService) {}

  async transform(value: CreateSubscriptionDto): Promise<CreateSubscriptionDto> {
    await this.cityValidation.validateCity(value.city);

    return value;
  }
}
