import { expect, test } from '@playwright/test';
import { Frequency } from 'src/subscriptions/domain/frequency.vo';
import { SubscriptionPage } from 'test/utils/subscription.page';

test.describe('Subscription Page', () => {
  let subscriptionPage: SubscriptionPage;

  test.beforeEach(async ({ page }) => {
    subscriptionPage = new SubscriptionPage(page);
    await subscriptionPage.gotoSubscriptionPage();
  });

  test('elements should be displayed', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Subscribe to Weather Updates');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#city')).toBeVisible();
    await expect(page.locator('#frequency')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle invalid email', async () => {
    await subscriptionPage.sendForm('invalidEmail', 'CityValid', Frequency.DAILY);
    await subscriptionPage.expectResultContains(/must be an email/i);
  });

  test('should handle invalid city', async () => {
    await subscriptionPage.sendForm('oopsgu2006@gmail.com', 'Invalid', Frequency.DAILY);
    await subscriptionPage.expectResultContains(/City Not Found/i, 10000);
  });

  test('should successfully subscribe', async () => {
    await subscriptionPage.sendForm('oopsgu2006@gmail.com', 'CityValid', Frequency.HOURLY);
    await subscriptionPage.expectResultContains(/confirmation mail sent/i, 10000);
  });

  test('should handle whole flow(first subscription created - second throws conflict)', async () => {
    await subscriptionPage.sendForm('oopsgu2006@gmail.com', 'CityValid', Frequency.HOURLY);
    await subscriptionPage.sendForm('oopsgu2006@gmail.com', 'CityValid', Frequency.DAILY);

    await subscriptionPage.expectResultContains(/conflict/i, 10000);
  });
});
