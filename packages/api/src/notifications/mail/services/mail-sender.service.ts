import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { ConfirmationEmail, UpdateEmail } from 'src/common/constants/types/email.interface';
import { Notification } from 'src/common/constants/types/notification.interface';
import { INotificationsSender } from '../../interfaces/notifications-sender.interface';
import { MailFormatter } from './mail-formatter.service';

@Injectable()
export class MailSender implements INotificationsSender {
  readonly type: NotificationType = NotificationType.EMAIL;

  constructor(
    private readonly mailFormatter: MailFormatter,
    private readonly mailerService: MailerService,
  ) {}

  async sendConfirmationNotification({ to, token, subject }: ConfirmationEmail): Promise<void> {
    const html = this.mailFormatter.buildConfirmationNotification(token);

    await this._sendEmail<ConfirmationEmail>({
      to,
      subject,
      html,
    });
  }

  async sendWeatherUpdateNotification({ to, subject, data }: UpdateEmail): Promise<void> {
    const html = this.mailFormatter.buildWeatherUpdateNotification(data);

    await this._sendEmail<UpdateEmail>({
      to,
      subject,
      html,
    });
  }

  private async _sendEmail<T extends Notification>(mailOptions: Partial<T>): Promise<void> {
    try {
      await this.mailerService.sendMail({ ...mailOptions });

      console.log(`Email sent to ${mailOptions.to}`);
    } catch (err) {
      console.log(`Error occured on sending email to ${mailOptions.to}: ${err.message}`);
    }
  }
}
