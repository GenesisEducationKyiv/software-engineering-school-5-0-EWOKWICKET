import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { CityExists } from 'src/application/city/validators/city-exists.validator';
import { Frequency } from 'src/domain/subscription/valueObjects/frequency.vo';

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
