import { ConfirmationNotification, WeatherUpdateNotification } from '../../constants/notification.interface';

export interface EmailNotification {
  html?: string;
}

//empty yet, but possibly filled in future
export interface ConfirmationEmail extends ConfirmationNotification, EmailNotification {}
export interface UpdateEmail extends WeatherUpdateNotification, EmailNotification {}
