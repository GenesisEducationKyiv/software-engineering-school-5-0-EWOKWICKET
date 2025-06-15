import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfirmationEmail, UpdateEmail } from 'src/common/constants/types/email.interface';
import { Notification } from 'src/common/constants/types/notification.interface';
import { INotificationsService } from '../interfaces/notifications-service.interface';

@Injectable()
export class MailSenderService implements INotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationNotification({ to, token, subject }: ConfirmationEmail): Promise<void> {
    const confirmUrl = `http://localhost:3000/weatherapi.app/api/confirm/${token}`;
    const unsubscribeUrl = `http://localhost:3000/weatherapi.app/api/unsubscribe/${token}`;
    const html = `
      <p> Click <a href="${confirmUrl}">here</a> to confirm email.</p> 
      <p> Click <a href=${unsubscribeUrl}>here</a> to unsubscribe.</p>
    `;

    await this._sendEmail<ConfirmationEmail>({
      to,
      subject,
      html,
    });
  }

  async sendWeatherUpdateNotification({ to, subject, data }: UpdateEmail): Promise<void> {
    const html = `
      <p>City: ${data.city}</p>
      <p>Temperature: ${data.temperature}°C</p>
      <p>Humidity: ${data.humidity}%</p>
      <p>Description: ${data.description}</p>
    `;

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
