import { Frequency } from '@common/contracts/subscription/domain/frequency.vo';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { CityExists } from 'src/subscription-domain/application/validators/city-exists.validator';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @CityExists()
  city: string;

  @IsEnum(Frequency)
  frequency: Frequency;
}
