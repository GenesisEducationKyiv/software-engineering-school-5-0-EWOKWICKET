import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NotificationType } from '../../../application/constants/notification-type.enum';
import { Notification } from '../../../application/constants/notification.type';
import { NotificationsSender } from '../../../application/interfaces/notifications-sender.interface';
import { ConfirmationEmail, UpdateEmail } from '../constants/email-notifications.type';
import { MailTemplateService } from './mail-template.service';

@Injectable()
export class MailSender implements NotificationsSender {
  readonly type: NotificationType = NotificationType.EMAIL;

  constructor(
    private readonly mailTemplateService: MailTemplateService,
    private readonly mailerService: MailerService,
  ) {}

  async sendConfirmationNotification({ to, token, subject }: ConfirmationEmail): Promise<void> {
    const html = this.mailTemplateService.buildConfirmationNotification(token);

    await this._sendEmail<ConfirmationEmail>({
      to,
      subject,
      html,
    });
  }

  async sendWeatherUpdateNotification({ to, subject, data }: UpdateEmail): Promise<void> {
    const html = this.mailTemplateService.buildWeatherUpdateNotification(data);

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
      console.error(`Error occured on sending email to ${mailOptions.to}: ${err}`);
    }
  }
}
