import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { MailService } from '../mail.service';

describe('MailService', () => {
  let mailService: MailService;

  const sendMailMock = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: sendMailMock,
          },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    sendMailMock.mockReset();
  });

  describe('send verification email', () => {
    it('should generate correct verification mail data', async () => {
      const objId = new mongoose.Types.ObjectId();
      await mailService.sendConfirmationEmail({
        to: 'test@mail.com',
        subject: 'confirm email',
        token: objId,
      });

      expect(sendMailMock).toHaveBeenCalledTimes(1);

      const mailOptions = sendMailMock.mock.calls[0][0];
      expect(mailOptions.to).toBe('test@mail.com');
      expect(mailOptions.subject).toBe('confirm email');
      expect(mailOptions.html).toContain(`confirm/${objId}`);
      expect(mailOptions.html).toContain(`unsubscribe/${objId}`);
    });
  });

  describe('send update email', () => {
    it('should generate correct update weather mail data', async () => {
      await mailService.sendUpdateEmail({
        to: 'test@mail.com',
        subject: 'confirm email',
        data: {
          temperature: 30,
          humidity: 40,
          description: 'Cloudy',
          city: 'Kyiv',
        },
      });

      expect(sendMailMock).toHaveBeenCalledTimes(1);

      const mailOptions = sendMailMock.mock.calls[0][0];
      expect(mailOptions.to).toBe('test@mail.com');
      expect(mailOptions.subject).toBe('confirm email');
      expect(mailOptions.html).toContain('City: Kyiv');
      expect(mailOptions.html).toContain('Temperature: 30');
      expect(mailOptions.html).toContain('Humidity: 40');
      expect(mailOptions.html).toContain('Description: Cloudy');
    });
  });

  describe('private send mail', () => {
    it('log error if sending mail fails', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      sendMailMock.mockRejectedValueOnce(new Error('SMTP error'));

      await (mailService as any).sendEmail({
        to: 'error@test.com',
        subject: 'error',
        html: '<p>error</p>',
      });

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error occured on sending email to error@test.com: SMTP error'));

      consoleSpy.mockRestore();
    });
  });
});
