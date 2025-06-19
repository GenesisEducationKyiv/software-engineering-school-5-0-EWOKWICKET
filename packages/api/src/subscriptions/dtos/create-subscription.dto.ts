import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsEnum(NotificationsFrequencies)
  frequency: NotificationsFrequencies;
}
