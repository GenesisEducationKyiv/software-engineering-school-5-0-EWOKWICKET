import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationSubjects } from 'src/common/notifications/notification-subjects.enum';
import { Frequency } from 'src/subscription/subscriptions/domain/frequency.vo';
import { WeatherUpdateInterface } from './interfaces/weather-update.abstract';

@Injectable()
export class WeatherSchedulerService {
  constructor(private readonly weatherUpdateService: WeatherUpdateInterface) {}

  @Cron(CronExpression.EVERY_HOUR)
  private async sendHourlyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_HOURLY);
    await this.weatherUpdateService.sendUpdates({
      frequency: Frequency.HOURLY,
      subject: NotificationSubjects.WEATHER_UPDATES_HOURLY,
      invalidateCache: true,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  private async sendDailyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_DAILY);
    await this.weatherUpdateService.sendUpdates({
      frequency: Frequency.DAILY,
      subject: NotificationSubjects.WEATHER_UPDATES_DAILY,
    });
  }
}
