import { expect, test } from '@playwright/test';
import { NotificationsFrequencies } from 'src/common/constants/enums/notifications-frequencies.enum';
import { SubscriptionPage } from 'test/utils/subscription.page';

test.describe('Subscription Page', () => {
  let subscriptionPage: SubscriptionPage;

  test.beforeEach(async ({ page }) => {
    subscriptionPage = new SubscriptionPage(page);
    await subscriptionPage.goto();
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

  test('should handle invalid city', async ({ page }) => {
    // mock endpoint
    await page.route('**/api/subscribe', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 400,
          message: 'No matching location found',
          possibleLocations: [],
        }),
      });
    });

    await subscriptionPage.sendForm('valid@mail.com', 'invalid', NotificationsFrequencies.DAILY);
    await subscriptionPage.expectResultContains(/possible locations/i);
  });

  test('should successfully subscribe', async ({ page }) => {
    // mock endpoint
    await page.route('**/api/subscribe', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Confirmation mail sent',
        }),
      });
    });

    await subscriptionPage.sendForm('valid@mail.com', 'Kyiv', NotificationsFrequencies.HOURLY);
    await subscriptionPage.expectResultContains(/confirmation mail sent/i);
  });

  test('should handle whole flow(first subsscription created - second is conflict)', async ({ page }) => {
    // mock endpoint
    await page.route('**/api/subscribe', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 409,
          message: 'Conflict Error',
        }),
      });
    });

    await subscriptionPage.sendForm('duplicate@mail.com', 'Kyiv', NotificationsFrequencies.HOURLY);
    await subscriptionPage.expectResultContains(/conflict/i);
  });
});
