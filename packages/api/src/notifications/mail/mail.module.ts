import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailConfig } from './config/mail.config';
import { MailFormatter } from './services/mail-formatter.service';
import { MailSender } from './services/mail-sender.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfig,
      inject: [MailConfig],
    }),
  ],
  providers: [MailSender, MailFormatter],
  exports: [MailSender],
})
export class MailModule {}
