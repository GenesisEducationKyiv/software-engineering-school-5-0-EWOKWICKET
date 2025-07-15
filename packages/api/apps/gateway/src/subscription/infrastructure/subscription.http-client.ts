import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SubscriptionClient } from '../application/interfaces/subscription-client.interface';
import { CreateSubscriptionDto } from '../presentation/dtos/create-subscription.dto';

@Injectable()
export class SubscriptionHttpClient implements SubscriptionClient {
  private readonly subscriptionBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    this.subscriptionBaseUrl = this.configService.get('urls.subscription');
  }

  async subscribe(subscribeDto: CreateSubscriptionDto) {
    await firstValueFrom(
      this.http.request({
        method: 'POST',
        baseURL: this.subscriptionBaseUrl,
        url: 'subscribe',
        data: subscribeDto,
      }),
    );
  }

  async confirm(token: string) {
    await firstValueFrom(
      this.http.request({
        method: 'GET',
        baseURL: this.subscriptionBaseUrl,
        url: `confirm/${token}`,
      }),
    );
  }

  async unsubscribe(token: string) {
    await firstValueFrom(
      this.http.request({
        method: 'GET',
        baseURL: this.subscriptionBaseUrl,
        url: `unsubscribe/${token}`,
      }),
    );
  }
}
