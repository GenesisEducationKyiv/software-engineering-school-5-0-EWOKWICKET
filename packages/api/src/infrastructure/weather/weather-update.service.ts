import { Injectable } from '@nestjs/common';
import { NotificationType } from 'src/application/notifications/constants/notification-type.enum';
import { NotificationsServiceInterface } from 'src/application/notifications/interfaces/notifications-service.abstract';
import { GroupSubscriptionRepository } from 'src/application/subscriptions/interfaces/subscription-repository.abstract';
import { WeatherUpdateInterface } from 'src/application/weather-scheduler/interfaces/weather-update.abstract';
import { WeatherUpdateOptions } from 'src/application/weather-scheduler/types/weather-update.options';
import { WeatherProvider } from 'src/application/weather/interfaces/weather-provider.abstract';
import { Subscription } from 'src/domain/subscription/subscription.entity';
import { CacheInvalidator } from '../../common/interfaces/cache-service.interface';
import { transformKey } from '../cache/utils/key-transformation';
import { CachePrefixes } from '../shared/constants/cache-prefixes.enum';

@Injectable()
export class WeatherUpdateService implements WeatherUpdateInterface {
  constructor(
    private readonly notificationsService: NotificationsServiceInterface,
    private readonly weatherService: WeatherProvider,
    private readonly subscriptionRepository: GroupSubscriptionRepository,
    private readonly cacheService: CacheInvalidator,
  ) {}

  async sendUpdates({ frequency, subject, invalidateCache = false }: WeatherUpdateOptions) {
    const grouped = await this.subscriptionRepository.findGroupedByCities(frequency);

    if (invalidateCache) {
      const cities = grouped.map((group) => group.city);
      this.invalidateCachedWeather(cities);
    }

    for (const group of grouped) {
      const city = group.city;
      const weather = await this.weatherService.getCurrentWeather(city);

      await Promise.all(
        group.subscriptions.map((subscription: Subscription) => {
          this.notificationsService.sendWeatherUpdateNotification(
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

  // invalidates weather cache
  private async invalidateCachedWeather(cities: string[]): Promise<void> {
    const keys = cities.map((city) => transformKey(CachePrefixes.CURRENT_WEATHER, city));
    await this.cacheService.mdel(keys);
  }
}
