import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsServiceInterface } from 'src/notifications/abstractions/notifications-service.abstract';
import { NotificationsFrequencies } from 'src/notifications/constants/enums/notification-frequencies.enum';
import { NotificationSubjects } from 'src/notifications/constants/enums/notification-subjects.enum';
import { NotificationType } from 'src/notifications/constants/enums/notification-type.enum';
import { WeatherUpdateNotificationsOptions } from 'src/notifications/constants/types/updates.options';
import { GroupSubscriptionRepository } from 'src/subscriptions/abstractions/subscription-repository.abstract';
import { WeatherServiceInterface } from 'src/weather/abstractions/current-weather.abstract';

@Injectable()
export class WeatherSchedulerService {
  constructor(
    @Inject(NotificationsServiceInterface)
    private readonly notificationsService: NotificationsServiceInterface,
    @Inject(WeatherServiceInterface)
    private readonly weatherService: WeatherServiceInterface,
    @Inject(GroupSubscriptionRepository)
    private readonly subscriptionRepository: GroupSubscriptionRepository,
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
    const grouped = await this.subscriptionRepository.findGroupedByCities(frequency);

    for (const group of grouped) {
      const city = group._id;
      const weather = await this.weatherService.getCurrentWeather(city);

      for (const subscription of group.subscriptions) {
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
}
