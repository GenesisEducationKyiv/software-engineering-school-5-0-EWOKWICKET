import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import Handlebars, { TemplateDelegate } from 'handlebars';
import * as path from 'path';
import { WeatherUpdate } from '../../../application/constants/weather-update.type';
import { TemplateParams } from '../constants/template.type';
import { Templates } from '../constants/templates.enum';

@Injectable()
export class MailTemplateService {
  private templates: Record<string, TemplateDelegate> = {};
  private readonly confirmURL: string;
  private readonly unsubscribeUrl: string;

  constructor(private readonly configServie: ConfigService) {
    this.confirmURL = this.configServie.get<string>('app.urls.confirm');
    this.unsubscribeUrl = this.configServie.get<string>('app.urls.unsubscribe');
    this.loadTemplates();
  }

  buildConfirmationNotification(token: string) {
    const confirmUrl = `${this.confirmURL}/${token}`;
    const unsubscribeUrl = `${this.unsubscribeUrl}/${token}`;
    const html = this.renderTemplate({
      template: Templates.CONFIRMATION,
      params: {
        confirmUrl,
        unsubscribeUrl,
      },
    });

    return html;
  }

  buildWeatherUpdateNotification(data: WeatherUpdate) {
    const html = this.renderTemplate({
      template: Templates.WEATHER_UPDATE,
      params: { ...data },
    });

    return html;
  }

  private renderTemplate(args: TemplateParams): string {
    const template = this.templates[args.template];
    if (!template) throw new InternalServerErrorException('Template Render Error');

    return template(args.params);
  }

  private loadTemplates(): void {
    this.compileTemplate(Templates.CONFIRMATION);
    this.compileTemplate(Templates.WEATHER_UPDATE);
  }

  private compileTemplate(name: string): void {
    const templatePath = path.join(process.cwd(), 'assets', 'templates', 'mail', `${name}.hbs`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    this.templates[name] = Handlebars.compile(template);
  }
}
