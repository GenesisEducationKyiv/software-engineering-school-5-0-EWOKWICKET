import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationSubjects } from 'src/application/notifications/constants/notification-subjects.enum';
import { NotificationType } from 'src/application/notifications/constants/notification-type.enum';
import { NotificationsServiceInterface } from 'src/domain/notifications/notifications-service.abstract';
import { Frequency } from 'src/domain/subscription/frequency.vo';
import { GroupSubscriptionRepository } from 'src/domain/subscription/interfaces/subscription-repository.abstract';
import { WeatherProvider } from 'src/domain/weather/interfaces/weather-provider.abstract';
import { CacheInvalidator } from 'src/infrastructure/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/infrastructure/cache/utils/key-transformation';
import { WeatherUpdateOptions } from 'src/infrastructure/scheduler/weather-scheduler/types/weather-update.options';
import { CachePrefixes } from 'src/infrastructure/shared/constants/cache-prefixes.enum';

@Injectable()
export class WeatherSchedulerService {
  constructor(
    private readonly notificationsService: NotificationsServiceInterface,
    private readonly weatherService: WeatherProvider,
    private readonly subscriptionRepository: GroupSubscriptionRepository,
    private readonly cacheService: CacheInvalidator,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  private async sendHourlyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_HOURLY);
    await this.sendUpdates({ frequency: Frequency.HOURLY, subject: NotificationSubjects.WEATHER_UPDATES_HOURLY, invalidateCache: true });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  private async sendDailyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_DAILY);
    await this.sendUpdates({ frequency: Frequency.DAILY, subject: NotificationSubjects.WEATHER_UPDATES_DAILY, invalidateCache: false });
  }

  private async sendUpdates({ frequency, subject, invalidateCache }: WeatherUpdateOptions) {
    const grouped = await this.subscriptionRepository.findGroupedByCities(frequency);

    if (invalidateCache) {
      const cities = grouped.map((group) => group.city);
      this.invalidateCachedWeather(cities);
    }

    for (const group of grouped) {
      const city = group.city;
      const weather = await this.weatherService.getCurrentWeather(city);

      await Promise.all(
        group.subscriptions.map((subscription) => {
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
