import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { CityExists } from 'src/common/validators/city-exists.validator';
import { NotificationsFrequencies } from 'src/notifications/constants/enums/notification-frequencies.enum';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @CityExists()
  city: string;

  @IsEnum(NotificationsFrequencies)
  frequency: NotificationsFrequencies;
}
