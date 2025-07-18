import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';

@Injectable()
export class NotificationTypeValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any) {
    if (!Object.values(NotificationType).includes(value)) {
      throw new InternalServerErrorException(`Invalid notification type: ${value}`);
    }
    return value as NotificationType;
  }
}
