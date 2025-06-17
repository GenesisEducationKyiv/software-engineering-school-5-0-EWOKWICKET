import { expect, test } from '@playwright/test';
import mongoose from 'mongoose';

test.describe('Subscription Page', () => {
  const publicUrl = 'http://localhost:3000/weatherapi.app/';

  test.beforeEach(async ({ page }) => {
    await page.goto(publicUrl);
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

  test('should handle invalid email', async ({ page }) => {
    await page.fill('#email', 'invalidEmail');
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');

    await page.click('button[type="submit"]');
    await expect(page.locator('#result')).toContainText(/must be an email/i);
  });

  test('should handle invalid city', async ({ page }) => {
    await page.fill('#email', 'valid@mail.com');
    await page.fill('#city', 'invalidCity');
    await page.selectOption('#frequency', 'hourly');

    await page.click('button[type="submit"]');
    await expect(page.locator('#result')).toContainText(/possible locations/i);
  });

  test('should successfully subscribe if data is valid and write a message', async ({ page }) => {
    await page.fill('#email', 'test@mail.com');
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');

    await page.click('button[type="submit"]');
    await expect(page.locator('#result')).toHaveText(/confirmation mail sent/i, { timeout: 6000 });
  });

  test('should handle subscription duplicate', async ({ page }) => {
    const email = `duplicate@mail.com`;

    // First subscription
    await page.fill('#email', email);
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(6000); // allow response

    // Reload and try again
    await page.reload();
    await page.fill('#email', email);
    await page.fill('#city', 'Kyiv');
    await page.selectOption('#frequency', 'daily');
    await page.click('button[type="submit"]');

    await expect(page.locator('#result')).toContainText(/conflict/i);
  });
});
