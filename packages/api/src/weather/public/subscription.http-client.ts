import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Frequency } from 'src/common/subscription/domain/frequency.vo';
import { SubscriptionClient } from './interfaces/subscription-client.interface';

@Injectable()
export class SubscriptionHttpClient implements SubscriptionClient {
  private readonly subscriptionBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    this.subscriptionBaseUrl = this.configService.get('urls.subscription');
  }

  async getGroupedSubscriptionsByFrequency(frequency: Frequency) {
    const { data } = await firstValueFrom(
      this.http.request({
        method: 'GET',
        baseURL: this.subscriptionBaseUrl,
        url: 'internal/groupedSubscription',
        params: { frequency },
      }),
    );
    return data;
  }
}
