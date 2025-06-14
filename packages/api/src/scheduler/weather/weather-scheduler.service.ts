import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RootFilterQuery } from 'mongoose';
import { MailSubjects } from 'src/common/constants/enums/mail-subjects.enum';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';
import { UpdatesOptions } from 'src/common/constants/types/updates.options';
import { Subscription } from 'src/database/schemas/subscription.schema';
import { MailSenderService } from 'src/notifications/mail/mail-sender.service';
import { WeatherService } from 'src/weather/services/weather.service';

export interface IWeatherSubscriptionRepository {
  find(options: RootFilterQuery<Subscription>);
}

@Injectable()
export class WeatherSchedulerService {
  constructor(
    @Inject('IWeatherSubscriptionRepository')
    private readonly subscriptionRepository: IWeatherSubscriptionRepository,
    private readonly mailService: MailSenderService,
    private readonly weatherService: WeatherService,
  ) {}

  @Cron('0 * * * *') // every hour(10, 11, 12, ...)
  private async sendHourlyUpdates() {
    console.log(MailSubjects.WEATHER_UPDATES_HOURLY);
    this._sendUpdates({ frequency: NotificationsFrequencies.HOURLY, subject: MailSubjects.WEATHER_UPDATES_HOURLY });
  }

  @Cron('0 8 * * *') // every day at 8am
  private async sendDailyUpdates() {
    console.log(MailSubjects.WEATHER_UPDATES_DAILY);
    this._sendUpdates({ frequency: NotificationsFrequencies.DAILY, subject: MailSubjects.WEATHER_UPDATES_DAILY });
  }

  private async _sendUpdates({ frequency, subject }: UpdatesOptions) {
    const subscriptions: Subscription[] = await this.subscriptionRepository.find({ confirmed: true, frequency });

    const groupedByCity = this._groupByCity(subscriptions);

    for (const city of Object.keys(groupedByCity)) {
      const weather = await this.weatherService.getCurrentWeather(city);

      for (const subscription of groupedByCity[city]) {
        await this.mailService.sendUpdateEmail({
          to: subscription.email,
          subject,
          data: {
            city,
            ...weather,
          },
        });
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
