import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subscription } from 'src/database/schemas/subscription.schema';
import { NotificationsFrequencies } from 'src/notifications/constants/enums/notification-frequencies.enum';
import { NotificationSubjects } from 'src/notifications/constants/enums/notification-subjects.enum';
import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { WeatherUpdateNotificationsOptions } from 'src/notifications/constants/types/updates.options';
import { ForecastWeatherService, ForecastWeatherServiceToken } from 'src/weather/interfaces/weather-service.interface';
import { NotificationsService, NotificationsServiceToken } from '../interfaces/notifications-service.interface';
import { FindSubscriptionService, FindSubscriptionServiceToken } from '../interfaces/subscription-service.interface';

@Injectable()
export class WeatherSchedulerService {
  constructor(
    @Inject(FindSubscriptionServiceToken)
    private readonly subscriptionService: FindSubscriptionService,
    @Inject(NotificationsServiceToken)
    private readonly notificationsService: NotificationsService,
    @Inject(ForecastWeatherServiceToken)
    private readonly weatherService: ForecastWeatherService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  private async sendHourlyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_HOURLY);
    this._sendUpdates({ frequency: NotificationsFrequencies.HOURLY, subject: NotificationSubjects.WEATHER_UPDATES_HOURLY });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  private async sendDailyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_DAILY);
    this._sendUpdates({ frequency: NotificationsFrequencies.DAILY, subject: NotificationSubjects.WEATHER_UPDATES_DAILY });
  }

  private async _sendUpdates({ frequency, subject }: WeatherUpdateNotificationsOptions) {
    const subscriptions = await this.subscriptionService.find({ confirmed: true, frequency });

    const groupedByCity = this._groupByCity(subscriptions);

    for (const city of Object.keys(groupedByCity)) {
      const weather = await this.weatherService.getCurrentWeather(city);

      for (const subscription of groupedByCity[city]) {
        await this.notificationsService.sendWeatherUpdateNotification(
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
      }
    }
  }

  private _groupByCity(subscriptions: Subscription[]) {
    const groupedByCity = subscriptions.reduce(
      (res, sub) => {
        if (!res[sub.city]) res[sub.city] = [];
        res[sub.city].push(sub);
        return res;
      },
      {} as Record<string, Subscription[]>,
    );

    return groupedByCity;
  }
}
