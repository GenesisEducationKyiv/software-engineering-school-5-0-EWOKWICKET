import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { Injectable } from '@nestjs/common';
import { NotificationsClient } from 'src/clients/interfaces/notifications-client.interface';
import { WeatherClient } from 'src/clients/interfaces/weather-client.interface';
import { GroupSubscriptionRepository } from 'src/subscription/application/interfaces/subscription-repository.abstract';
import { WeatherUpdateInterface } from '../application/interfaces/weather-update.abstract';
import { WeatherUpdateOptions } from '../application/types/weather-update.options';

@Injectable()
export class WeatherUpdateService implements WeatherUpdateInterface {
  constructor(
    private readonly notifications: NotificationsClient,
    private readonly weather: WeatherClient,
    private readonly repo: GroupSubscriptionRepository,
  ) {}

  async sendUpdates({ frequency, subject }: WeatherUpdateOptions) {
    const grouped = await this.repo.findGroupedByCities(frequency);

    for (const group of grouped) {
      const city = group.city;
      const weather = await this.weather.getCurrentWeather(city);

      await Promise.all(
        group.subscriptions.map((subscription) => {
          this.notifications.sendWeatherUpdateNotification(
            {
              to: subscription.email,
              subject,
              data: {
                city,
                ...weather,
              },
            },
            NotificationType.EMAIL,
          );
        }),
      );
    }
  }
}
