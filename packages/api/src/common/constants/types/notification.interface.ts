import mongoose from 'mongoose';
import { CurrentWeatherResponseDto } from 'src/weather/dtos/current-weather-response.dto';

export interface Notification {
  to: string;
  subject: string;
}

export interface ConfirmationNotification extends Notification {
  token: mongoose.Types.ObjectId;
}

export interface UpdateWeatherNotification extends Notification {
  data: {
    city: string;
  } & CurrentWeatherResponseDto;
}
