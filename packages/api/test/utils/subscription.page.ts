import { Page, expect } from '@playwright/test';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';

export class SubscriptionPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('http://localhost:3000/weatherapi.app/');
  }

  async sendForm(email: string, city: string, frequency: NotificationsFrequencies) {
    await this.page.fill('#email', email);
    await this.page.fill('#city', city);
    await this.page.selectOption('#frequency', frequency);
    await this.page.click('button[type="submit"]');
  }

  async expectResultContains(text: RegExp) {
    await expect(this.page.locator('#result')).toContainText(text);
  }
}
