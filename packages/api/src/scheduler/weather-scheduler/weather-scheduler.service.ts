import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailSubjects } from 'src/common/constants/enums/mail-subjects.enum';
import { NotificationType } from 'src/common/constants/enums/notification-type.enum';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';
import { WeatherUpdateNotificationsOptions } from 'src/common/constants/types/updates.options';
import { Subscription } from 'src/database/schemas/subscription.schema';
import { ForecastWeatherServiceToken, IForecastWeatherService } from 'src/weather/interfaces/weather-service.interface';
import { INotificationsService, NotificationsServiceToken } from '../interfaces/notifications-service.interface';
import { FindSubscriptionServiceToken, IFindSubscriptionService } from '../interfaces/subscription-service.interface';

@Injectable()
export class WeatherSchedulerService {
  constructor(
    @Inject(FindSubscriptionServiceToken)
    private readonly subscriptionService: IFindSubscriptionService,
    @Inject(NotificationsServiceToken)
    private readonly notificationsService: INotificationsService,
    @Inject(ForecastWeatherServiceToken)
    private readonly weatherService: IForecastWeatherService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  private async sendHourlyUpdates() {
    console.log(MailSubjects.WEATHER_UPDATES_HOURLY);
    this._sendUpdates({ frequency: NotificationsFrequencies.HOURLY, subject: MailSubjects.WEATHER_UPDATES_HOURLY });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  private async sendDailyUpdates() {
    console.log(MailSubjects.WEATHER_UPDATES_DAILY);
    this._sendUpdates({ frequency: NotificationsFrequencies.DAILY, subject: MailSubjects.WEATHER_UPDATES_DAILY });
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
