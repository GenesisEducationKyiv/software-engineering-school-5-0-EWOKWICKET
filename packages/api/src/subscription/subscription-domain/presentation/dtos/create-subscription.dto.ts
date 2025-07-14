import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { CityExists } from 'src/subscription/subscription-domain/application/validators/city-exists.validator';

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
