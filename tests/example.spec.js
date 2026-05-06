import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.js';
import { LoadSheet } from '../pages/load_sheet.js';

// Increase timeout to 60s to allow for login + modal closing
test.describe('Ecom Tests', () => {
  test.setTimeout(60000);

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.loginWithDefaults(); // logs in + closes all modals
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/ECOM Merchant/i); // fixed to match actual title
  });

  test('login test', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/i);
  });

  test('LoadSheet test', async ({ page }) => {
    const loadSheet = new LoadSheet(page);

    await loadSheet.generateLoadSheetFlow(
      '2026-04-22',
      '2026-04-30',
      'test',
      '123'
    );
  });
});

/*test('Arrivals test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const myArrivals = new MyArrivals(page);
 
  await loginPage.goto();
  await loginPage.loginWithDefaults();
 
  await myArrivals.navigateToMyArrivals();
 
  await expect(page).toHaveURL(/arrivals/i);
});*/

