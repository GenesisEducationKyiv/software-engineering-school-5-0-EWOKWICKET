import mongoose from 'mongoose';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';

export interface MailOptions {
  to: string;
  subject: string;
  html?: string;
}

export interface ConfirmationMailOptions extends MailOptions {
  token: mongoose.Types.ObjectId;
}

export interface UpdateMailOptions extends MailOptions {
  data: {
    city: string;
  } & CurrentWeatherResponseDto;
}
