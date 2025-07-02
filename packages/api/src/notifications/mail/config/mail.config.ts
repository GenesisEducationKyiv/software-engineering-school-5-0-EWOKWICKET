import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfig implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('mail.mailHost'),
        port: this.configService.get<number>('mail.mailPort'),
        secure: false,
        auth: {
          user: this.configService.get<string>('mail.mailUser'),
          pass: this.configService.get<string>('mail.mailPass'),
        },
      },
    };
  }
}
