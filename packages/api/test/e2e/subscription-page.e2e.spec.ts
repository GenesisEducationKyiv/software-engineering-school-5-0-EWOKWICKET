import { expect, test } from '@playwright/test';
import mongoose from 'mongoose';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';
import { SubscriptionPage } from 'test/utils/subscription.page';

test.describe('Subscription Page', () => {
  let subscriptionPage: SubscriptionPage;

  test.beforeEach(async ({ page }) => {
    subscriptionPage = new SubscriptionPage(page);
    await subscriptionPage.goto();
  });

  test.afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const col in collections) {
      collections[col].deleteMany();
    }
  });

  test('elements should be displayed', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Subscribe to Weather Updates');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#city')).toBeVisible();
    await expect(page.locator('#frequency')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle invalid email', async () => {
    await subscriptionPage.sendForm('invalidEmail', 'Kyiv', NotificationsFrequencies.DAILY);
    await subscriptionPage.expectResultContains(/must be an email/i);
  });

  test('should handle invalid city', async () => {
    subscriptionPage.mockCitySearch('Kyiv');
    await subscriptionPage.sendForm('valid@mail.com', 'invalidCity', NotificationsFrequencies.DAILY);
    await subscriptionPage.expectResultContains(/possible locations/i);
  });

  test('should successfully subscribe', async () => {
    subscriptionPage.mockCitySearch('Kyiv');
    await subscriptionPage.sendForm('valid@mail.com', 'Kyiv', NotificationsFrequencies.HOURLY);
    await subscriptionPage.expectResultContains(/confirmation mail sent/i);
  });

  test('should handle whole flow(first subsscription created - second is conflict)', async () => {
    const subscriptionMock = {
      email: 'duplicate@mail.com',
      city: 'Kyiv',
      frequency: NotificationsFrequencies.HOURLY,
    };
    subscriptionPage.mockCitySearch(subscriptionMock.city);

    // First subscription
    await subscriptionPage.sendForm(subscriptionMock.email, subscriptionMock.city, subscriptionMock.frequency);
    await subscriptionPage.expectResultContains(/confirmation mail sent/i);

    // Reload and try again
    await subscriptionPage.sendForm(subscriptionMock.email, subscriptionMock.city, subscriptionMock.frequency);
    await subscriptionPage.expectResultContains(/conflict/i);
  });
});
