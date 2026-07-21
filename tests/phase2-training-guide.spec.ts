import { expect, test } from '@playwright/test';

const BASE_URL = process.env.GUIDE_BASE_URL ?? 'http://127.0.0.1:4173';

test('legacy Phase 2 entry points to the current web-only guide', async ({ page }) => {
  await page.goto(`${BASE_URL}/#phase-2`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('article#phase-2')).toBeVisible();
  await expect(page.locator('.guide-section')).toHaveCount(40);
  await expect(page.locator('.guide-section.level-1')).toHaveCount(9);
  await expect(page.locator('.guide-section.level-2')).toHaveCount(31);
  await expect(page.locator('button.download-button')).toBeDisabled();
  await expect(page.locator('a[href$=".docx"]')).toHaveCount(0);
});