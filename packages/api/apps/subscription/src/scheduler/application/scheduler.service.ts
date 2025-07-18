import { NotificationSubjects } from '@common/contracts/notifications/constants/notification-subjects.enum';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Frequency } from 'src/subscription/domain/frequency.vo';
import { WeatherUpdateInterface } from './interfaces/weather-update.abstract';

@Injectable()
export class SchedulerService {
  constructor(private readonly weatherUpdateService: WeatherUpdateInterface) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  private async sendHourlyUpdates() {
    console.log(NotificationSubjects.WEATHER_UPDATES_HOURLY);
    await this.weatherUpdateService.sendUpdates({
      frequency: Frequency.HOURLY,
      subject: NotificationSubjects.WEATHER_UPDATES_HOURLY,
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
