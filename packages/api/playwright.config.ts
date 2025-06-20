import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    trace: 'off',
  },
  webServer: {
    command: 'sh -c "yarn start:prod"',
    cwd: '/app/api',
    port: 3000,
  },
});
