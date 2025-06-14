import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { MailService } from 'src/notifications/mail/mail-sender.service';
import { WeatherService } from 'src/weather/services/weather.service';
import { Subscription } from '../../database/schemas/subscription.schema';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { SubscriptionService } from '../subscription.service';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;
  let weatherService: jest.Mocked<WeatherService>;
  let mailService: jest.Mocked<MailService>;
  let subscriptionModel: Model<Subscription>;

  beforeAll(async () => {
    const weatherServiceMock = { searchCities: jest.fn() };
    const mailServiceMock = { sendConfirmationEmail: jest.fn() };

    const subscriptionModelMock = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        email: 'test@mail.com',
        city: 'London',
        frequency: 'hourly',
      }),
    }));
    (subscriptionModelMock as any).findByIdAndDelete = jest.fn();
    (subscriptionModelMock as any).findByIdAndUpdate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: WeatherService,
          useValue: weatherServiceMock,
        },
        {
          provide: MailService,
          useValue: mailServiceMock,
        },
        {
          provide: getModelToken(Subscription.name),
          useValue: subscriptionModelMock,
        },
      ],
    }).compile();

    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    weatherService = module.get<WeatherService>(WeatherService) as jest.Mocked<WeatherService>;
    mailService = module.get<MailService>(MailService) as jest.Mocked<MailService>;
    subscriptionModel = module.get<Model<Subscription>>(getModelToken(Subscription.name));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('subscribe', () => {
    const mockDto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'London',
      frequency: 'daily',
    };

    it('should successfully subscribe', async () => {
      const savedSubscription = {
        _id: 'abc123',
        email: mockDto.email,
        city: mockDto.city,
        frequency: mockDto.frequency,
      };

      weatherService.searchCities.mockResolvedValue(['London', 'Londonderry', 'Londoko']);
      const saveMock = jest.fn().mockResolvedValue(savedSubscription);
      (subscriptionModel as any).mockImplementation(() => ({ save: saveMock, _id: savedSubscription._id }));

      await subscriptionService.subscribe(mockDto);

      expect(weatherService.searchCities).toHaveBeenCalledWith(mockDto.city);
      expect(saveMock).toHaveBeenCalled();
      expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith({
        to: mockDto.email,
        subject: 'Confirm subscription',
        token: savedSubscription._id,
      });
    });

    it('throws BadRequestException when city not found', async () => {
      weatherService.searchCities.mockResolvedValue(['London']);

      await expect(subscriptionService.subscribe({ ...mockDto, city: 'Londo' })).rejects.toThrow(BadRequestException);
      expect(weatherService.searchCities).toHaveBeenCalledWith('Londo');
    });

    it('throws ConflictException when email already subscribed', async () => {
      weatherService.searchCities.mockResolvedValue(['London']);

      const saveMock = jest.fn().mockRejectedValue({ code: 11000 });
      const subscriptionInstanceMock = { save: saveMock, _id: 'abc123' };
      (subscriptionModel as any).mockImplementation(() => subscriptionInstanceMock);

      await expect(subscriptionService.subscribe(mockDto)).rejects.toThrow(ConflictException);
      expect(subscriptionModel.findByIdAndDelete).toHaveBeenCalledWith('abc123');
    });

    it('throws other errors', async () => {
      const mockError = new Error('some error');
      weatherService.searchCities.mockResolvedValue(['London']);

      const saveMock = jest.fn().mockRejectedValue(mockError);
      const subscriptionInstanceMock = { save: saveMock, _id: 'abc123' };
      (subscriptionModel as any).mockImplementationOnce(() => subscriptionInstanceMock);

      await expect(subscriptionService.subscribe(mockDto)).rejects.toThrow(mockError);
      expect(subscriptionModel.findByIdAndDelete).toHaveBeenCalledWith('abc123');
    });
  });

  const mockedToken = new mongoose.Types.ObjectId().toHexString();
  const mockedInvalidToken = 'invalidToken';
  const mockedModelResolvedValue = { _id: mockedToken, confirmed: true };

  describe('confirm', () => {
    it('confirmation successful', async () => {
      const mockedUpdate = jest.fn().mockResolvedValue(mockedModelResolvedValue);
      (subscriptionModel as any).findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockedUpdate });

      await expect(subscriptionService.confirm(mockedToken)).resolves.toBeUndefined();

      expect(subscriptionModel.findByIdAndUpdate).toHaveBeenCalledWith(mockedToken, { confirmed: true, expiresAt: null });
      expect(mockedUpdate).toHaveBeenCalled();
    });

    it('confirmation fails if token not found', async () => {
      const mockedFailedUpdate = jest.fn().mockResolvedValue(null);
      (subscriptionModel as any).findByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockedFailedUpdate });

      await expect(subscriptionService.confirm(mockedToken)).rejects.toThrow(NotFoundException);

      expect(subscriptionModel.findByIdAndUpdate).toHaveBeenCalledWith(mockedToken, { confirmed: true, expiresAt: null });
      expect(mockedFailedUpdate).toHaveBeenCalled();
    });

    it('confirmation fails if token is invalid', async () => {
      await expect(subscriptionService.confirm(mockedInvalidToken)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unsubscribe', () => {
    it('unsubscription successful', async () => {
      const mockedDelete = jest.fn().mockResolvedValue(mockedModelResolvedValue);
      (subscriptionModel as any).findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockedDelete });

      await expect(subscriptionService.unsubscribe(mockedToken)).resolves.toBeUndefined();

      expect(subscriptionModel.findByIdAndDelete).toHaveBeenCalledWith(mockedToken);
      expect(mockedDelete).toHaveBeenCalled();
    });

    it('unsubscription fails if token not found', async () => {
      const mockedFailedDelete = jest.fn().mockResolvedValue(null);
      (subscriptionModel as any).findByIdAndDelete = jest.fn().mockReturnValue({ exec: mockedFailedDelete });

      await expect(subscriptionService.unsubscribe(mockedToken)).rejects.toThrow(NotFoundException);

      expect(subscriptionModel.findByIdAndDelete).toHaveBeenCalledWith(mockedToken);
      expect(mockedFailedDelete).toHaveBeenCalled();
    });

    it('unsubscription fails if token is invalid', async () => {
      await expect(subscriptionService.unsubscribe(mockedInvalidToken)).rejects.toThrow(NotFoundException);
    });
  });
});
