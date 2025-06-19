import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailConfig } from './config/mail.config';
import { MailSender } from './services/mail-sender.service';
import { MailTemplateService } from './services/mail-template.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfig,
      inject: [MailConfig],
    }),
  ],
  providers: [MailSender, MailTemplateService, MailConfig],
  exports: [MailSender],
})
export class MailModule {}
