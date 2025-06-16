import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Url } from 'src/common/constants/enums/url.constants';
import { WeatherUpdateInterface } from 'src/common/constants/types/weather-update.interface';

@Injectable()
export class MailFormatter {
  buildConfirmationNotification(token: Types.ObjectId) {
    const confirmUrl = `${Url.CONFIRM}/${token}`;
    const unsubscribeUrl = `${Url.UNSUBSCRIBE}/${token}`;
    const html = `
        <p> Click <a href="${confirmUrl}">here</a> to confirm email.</p> 
        <p> Click <a href=${unsubscribeUrl}>here</a> to unsubscribe.</p>
    `;

    return html;
  }
  buildWeatherUpdateNotification(data: WeatherUpdateInterface) {
    const html = `
        <p>City: ${data.city}</p>
        <p>Temperature: ${data.temperature}°C</p>
        <p>Humidity: ${data.humidity}%</p>
        <p>Description: ${data.description}</p>
    `;

    return html;
  }
}
