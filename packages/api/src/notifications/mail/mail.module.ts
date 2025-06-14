import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailConfig } from './config/mail.config';
import { MailSenderService } from './mail-sender.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfig,
      inject: [MailConfig],
    }),
  ],
  providers: [MailSenderService, MailConfig],
  exports: [MailSenderService],
})
export class MailModule {}
