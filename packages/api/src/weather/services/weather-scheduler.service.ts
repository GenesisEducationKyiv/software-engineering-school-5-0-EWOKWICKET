import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { Subscription } from 'src/subscriptions/schemas/subscription.schema';
import { SendUpdatesOptions } from '../config/send-updates.options';
import { WeatherService } from './weather.service';

@Injectable()
export class WeatherSchedulerService {
  constructor(
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    private readonly mailService: MailService,
    private readonly weatherService: WeatherService,
  ) {}

  @Cron('0 * * * *') // every hour(10, 11, 12, ...)
  private async sendHourlyUpdates() {
    console.log('Sending hourly updates...');
    this.sendUpdates({ frequency: 'hourly', subject: 'Hourly weather update' });
  }

  @Cron('0 8 * * *') // every day at 8am
  private async sendDailyUpdates() {
    console.log('Sending daily updates...');
    this.sendUpdates({ frequency: 'daily', subject: 'Daily weather update' });
  }

  private async sendUpdates({ frequency, subject }: SendUpdatesOptions) {
    const subscriptions: Subscription[] = await this.subscriptionModel.find({ confirmed: true, frequency });

    const groupedByCity = this.groupByCity(subscriptions);

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

  private groupByCity(subscriptions: Subscription[]) {
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
