import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { CityExists } from 'src/city/application/validators/city-exists.validator';
import { Frequency } from '../domain/frequency.vo';

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
