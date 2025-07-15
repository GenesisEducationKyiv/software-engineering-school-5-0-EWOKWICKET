import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { NotificationsClient } from './interfaces/notifications-client.interface';

@Injectable()
export class NotificationsHttpClient implements NotificationsClient {
  private readonly notificationsBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    this.notificationsBaseUrl = this.configService.get('urls.notifications');
  }

  async sendWeatherUpdateNotification(data: unknown, type: NotificationType) {
    await firstValueFrom(
      this.http.request({
        method: 'POST',
        baseURL: this.notificationsBaseUrl,
        url: 'weatherUpdate',
        data: { data, type },
      }),
    );
  }
}
