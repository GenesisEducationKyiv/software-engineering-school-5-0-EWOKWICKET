import mongoose from 'mongoose';
import { WeatherUpdateInterface } from './weather-update.interface';

export interface Notification {
  to: string;
  subject: string;
}

export interface ConfirmationNotification extends Notification {
  token: mongoose.Types.ObjectId;
}

export interface WeatherUpdateNotification extends Notification {
  data: WeatherUpdateInterface;
}
