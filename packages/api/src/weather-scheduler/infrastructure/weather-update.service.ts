import { Injectable } from '@nestjs/common';
import { CacheInvalidator } from 'src/cache/application/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/infrastructure/utils/key-transformation';
import { NotificationType } from 'src/notifications/application/constants/notification-type.enum';
import { NotificationsServiceInterface } from 'src/notifications/application/interfaces/notifications-service.abstract';
import { GroupSubscriptionRepository } from 'src/subscriptions/application/interfaces/subscription-repository.abstract';
import { Subscription } from 'src/subscriptions/domain/subscription.entity';
import { WeatherCachePrefixes } from 'src/weather/application/constants/weather-cache-prefixes.enum';
import { WeatherProvider } from 'src/weather/application/interfaces/weather-provider.abstract';
import { WeatherUpdateInterface } from '../application/interfaces/weather-update.abstract';
import { WeatherUpdateOptions } from '../application/types/weather-update.options';

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
    const keys = cities.map((city) => transformKey(WeatherCachePrefixes.CURRENT_WEATHER, city));
    await this.cacheService.mdel(keys);
  }
}
