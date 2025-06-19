import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationsFrequencies } from 'src/notifications/constants/enums/notification-frequencies.enum';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(NotificationsFrequencies)
  frequency: NotificationsFrequencies;
}
