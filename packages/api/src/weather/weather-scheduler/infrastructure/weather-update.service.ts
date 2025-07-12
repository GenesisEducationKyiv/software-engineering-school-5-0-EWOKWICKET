import { Injectable } from '@nestjs/common';
import { NotificationsFacadeInterface } from 'src/common/interfaces/notifications-facade.interface';
import { SubscriptionFacadeRepository } from 'src/common/interfaces/subscription-facade.interface';
import { NotificationType } from 'src/common/notifications/constants/notification-type.enum';
import { CacheInvalidator } from 'src/weather/cache/application/interfaces/cache-service.interface';
import { createCacheKey } from 'src/weather/common/cache/utils/create-cache-key';
import { WeatherProvider } from 'src/weather/weather/application/interfaces/weather-provider.abstract';
import { WeatherCachePrefixes } from 'src/weather/weather/infrastructure/constants/weather-cache-prefixes.enum';
import { WeatherUpdateInterface } from '../application/interfaces/weather-update.abstract';
import { WeatherUpdateOptions } from '../application/types/weather-update.options';

@Injectable()
export class WeatherUpdateService implements WeatherUpdateInterface {
  constructor(
    private readonly notifications: NotificationsFacadeInterface,
    private readonly weather: WeatherProvider,
    private readonly cacheService: CacheInvalidator,
    private readonly subscription: SubscriptionFacadeRepository,
  ) {}

  async sendUpdates({ frequency, subject, invalidateCache = false }: WeatherUpdateOptions) {
    const grouped = await this.subscription.getGroupedSubscriptionsByFrequency(frequency);

    if (invalidateCache) {
      const cities = grouped.map((group) => group.city);
      this.invalidateCachedWeather(cities);
    }

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

  // invalidates weather cache
  private async invalidateCachedWeather(cities: string[]): Promise<void> {
    const keys = cities.map((city) => createCacheKey(WeatherCachePrefixes.CURRENT_WEATHER, city));
    await this.cacheService.mdel(keys);
  }
}
