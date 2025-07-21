import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';

@Injectable()
export class NotificationTypeValidationPipe implements PipeTransform {
  transform(value: string) {
    if (!Object.values(NotificationType).includes(value as NotificationType)) {
      throw new InternalServerErrorException(`Invalid notification type: ${value}`);
    }
    return value as NotificationType;
  }
}
