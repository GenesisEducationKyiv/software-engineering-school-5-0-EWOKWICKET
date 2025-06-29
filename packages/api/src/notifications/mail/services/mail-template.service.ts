import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars, { TemplateDelegate } from 'handlebars';
import * as path from 'path';
import { Url } from 'src/common/enums/url.constants';
import { WeatherUpdateInterface } from 'src/notifications/constants/types/weather-update.interface';
import { Templates } from '../constants/enums/templates.enum';
import { TemplateParams } from '../constants/types/template.type';

@Injectable()
export class MailTemplateService {
  private templates: Record<string, TemplateDelegate> = {};

  constructor() {
    this._loadTemplates();
  }

  buildConfirmationNotification(token: string) {
    const confirmUrl = `${Url.CONFIRM}/${token}`;
    const unsubscribeUrl = `${Url.UNSUBSCRIBE}/${token}`;
    const html = this._renderTemplate({
      template: Templates.CONFIRMATION,
      params: {
        confirmUrl,
        unsubscribeUrl,
      },
    });

    return html;
  }

  buildWeatherUpdateNotification(data: WeatherUpdateInterface) {
    const html = this._renderTemplate({
      template: Templates.WEATHER_UPDATE,
      params: { ...data },
    });

    return html;
  }

  private _renderTemplate(args: TemplateParams): string {
    const template = this.templates[args.template];
    if (!template) throw new InternalServerErrorException('Template Render Error');

    return template(args.params);
  }

  private _loadTemplates(): void {
    this._compileTemplate(Templates.CONFIRMATION);
    this._compileTemplate(Templates.WEATHER_UPDATE);
  }

  private _compileTemplate(name: string): void {
    const templatePath = path.join(process.cwd(), 'assets', 'templates', 'mail', `${name}.hbs`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    this.templates[name] = Handlebars.compile(template);
  }
}
