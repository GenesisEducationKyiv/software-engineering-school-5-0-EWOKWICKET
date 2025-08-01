import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';

export type EmailNotification = {
  html?: string;
};

//empty yet, but possibly filled in future
export type ConfirmationEmail = ConfirmationNotification & EmailNotification;
export type UpdateEmail = WeatherUpdateNotification & EmailNotification;
