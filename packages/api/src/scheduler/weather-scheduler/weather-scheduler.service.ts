import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheInvalidator } from 'src/cache/interfaces/cache-service.interface';
import { transformKey } from 'src/cache/utils/key-transformation';
import { NotificationsFrequencies } from 'src/notifications/constants/enums/notification-frequencies.enum';
import { NotificationSubjects } from 'src/notifications/constants/enums/notification-subjects.enum';
import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { WeatherUpdateOptions } from 'src/notifications/constants/types/updates.options';
import { NotificationsServiceInterface } from 'src/notifications/interfaces/notifications-service.abstract';
import { GroupSubscriptionRepository } from 'src/subscriptions/interfaces/subscription-repository.abstract';
import { WeatherCachePrefixes } from 'src/weather/infrastructure/cache/weather-cache-prefixes.enum';
import { WeatherProvider } from 'src/weather/interfaces/current-weather.abstract';

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
    await this.sendUpdates({ frequency: NotificationsFrequencies.HOURLY, subject: NotificationSubjects.WEATHER_UPDATES_HOURLY, invalidateCache: true });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  private async sendDailyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_DAILY);
    await this.sendUpdates({ frequency: NotificationsFrequencies.DAILY, subject: NotificationSubjects.WEATHER_UPDATES_DAILY, invalidateCache: false });
  }

  private async sendUpdates({ frequency, subject, invalidateCache }: WeatherUpdateOptions) {
    const grouped = await this.subscriptionRepository.findGroupedByCities(frequency);

    if (invalidateCache) {
      const cities = grouped.map((group) => group._id);
      this.invalidateCachedWeather(cities);
    }

    for (const group of grouped) {
      const city = group._id;
      const weather = await this.weatherService.getCurrentWeather(city);

      await Promise.all(
        group.map((subscription) => {
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
