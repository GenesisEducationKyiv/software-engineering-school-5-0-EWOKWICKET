import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsIn(['hourly', 'daily'])
  frequency: 'daily' | 'hourly';
}
