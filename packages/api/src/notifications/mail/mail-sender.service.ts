import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfirmationMailOptions, MailOptions, UpdateMailOptions } from '../../common/constants/types/mail.options';

@Injectable()
export class MailSenderService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail({ to, token, subject }: ConfirmationMailOptions) {
    const confirmUrl = `http://localhost:3000/weatherapi.app/api/confirm/${token}`;
    const unsubscribeUrl = `http://localhost:3000/weatherapi.app/api/unsubscribe/${token}`;
    const html = `
      <p> Click <a href="${confirmUrl}">here</a> to confirm email.</p> 
      <p> Click <a href=${unsubscribeUrl}>here</a> to unsubscribe.</p>
    `;

    await this.sendEmail({
      to,
      subject,
      html,
    });
  }

  async sendUpdateEmail({ to, subject, data }: UpdateMailOptions) {
    const html = `
      <p>City: ${data.city}</p>
      <p>Temperature: ${data.temperature}°C</p>
      <p>Humidity: ${data.humidity}%</p>
      <p>Description: ${data.description}</p>
    `;

    await this.sendEmail({
      to,
      subject,
      html,
    });
  }

  private async sendEmail(mailOptions: MailOptions) {
    try {
      await this.mailerService.sendMail({ ...mailOptions });

      console.log(`Email sent to ${mailOptions.to}`);
    } catch (err) {
      console.log(`Error occured on sending email to ${mailOptions.to}: ${err.message}`);
    }
  }
}
