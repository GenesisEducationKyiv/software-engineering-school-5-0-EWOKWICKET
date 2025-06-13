import mongoose from 'mongoose';
import { FullCurrentWeatherDto } from 'src/weather/dtos/location-current-weather.dto';

export interface MailOptions {
  to: string;
  subject: string;
  html?: string;
}

export interface ConfirmationMailOptions extends MailOptions {
  token: mongoose.Types.ObjectId;
}

export interface UpdateMailOptions extends MailOptions {
  data: FullCurrentWeatherDto;
}
