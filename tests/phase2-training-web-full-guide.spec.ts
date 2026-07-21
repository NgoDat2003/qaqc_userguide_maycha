import { expect, test, type Page } from '@playwright/test';
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const guide = require('../src/content/guide-content.json') as {
  sections: Array<{ blocks: Array<{ type: string }> }>;
};

const BASE_URL = process.env.GUIDE_BASE_URL ?? 'http://127.0.0.1:4173';
const PHASE2_SECTIONS = guide.sections.slice(50);
const PHASE2_IMAGES = PHASE2_SECTIONS.flatMap((section) =>
  section.blocks.filter((block) => block.type === 'image'),
);

async function assertImages(page: Page) {
  const images = page.locator('.guide-figure img');
  await expect(images).toHaveCount(PHASE2_IMAGES.length);
  await images.evaluateAll((nodes) => nodes.forEach((node) => {
    (node as HTMLImageElement).loading = 'eager';
  }));
  await page.waitForFunction(() => Array.from(document.querySelectorAll<HTMLImageElement>('.guide-figure img'))
    .every((image) => image.complete), undefined, { timeout: 60_000 });
  expect(await images.evaluateAll((nodes) => nodes
    .filter((node) => (node as HTMLImageElement).naturalWidth === 0).length)).toBe(0);
}

async function assertNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - window.innerWidth,
    tables: Array.from(document.querySelectorAll<HTMLElement>('.table-wrap'))
      .filter((node) => node.getBoundingClientRect().right > window.innerWidth + 1).length,
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.tables).toBe(0);
}

async function assertCurrentTargetVisible(page: Page) {
  const hash = await page.evaluate(() => decodeURIComponent(location.hash.slice(1)));
  const box = await page.locator(`#${hash}`).boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(-2);
  expect(box!.y).toBeLessThan(page.viewportSize()!.height);
}

for (const viewport of [
  { name: 'desktop-1440x900', width: 1440, height: 900, mobile: false },
  { name: 'mobile-390x844', width: 390, height: 844, mobile: true },
]) {
  test(`${viewport.name}: full Phase 2 Training guide`, async ({ page }) => {
    test.setTimeout(150_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const badResponses: string[] = [];
    const wordRequests: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
    });
    page.on('request', (request) => {
      if (/\.docx(?:$|\?)/i.test(request.url())) wordRequests.push(request.url());
    });

    await page.goto(`${BASE_URL}/#phase-2`, { waitUntil: 'networkidle' });
    await expect(page.locator('article#phase-2')).toBeVisible();
    await expect(page.locator('.guide-section')).toHaveCount(40);
    await expect(page.locator('.guide-section.level-1')).toHaveCount(9);
    await expect(page.locator('.guide-section.level-2')).toHaveCount(31);
    await expect(page.locator('.header-tags')).toContainText('40 mục trong phần');
    await expect(page.locator('.header-tags')).toContainText(`${PHASE2_IMAGES.length} ảnh trong phần`);
    await assertImages(page);

    const bodyText = await page.locator('body').innerText();
    for (const role of ['TnD Manager', 'Taskforce', 'COO', 'OM', 'AM', 'SM']) {
      expect(bodyText).toContain(role);
    }
    expect(bodyText).toContain('được TnD phân công đích danh');
    expect(bodyText).toContain('cửa hàng thuộc phạm vi AM quản lý');
    expect(bodyText).toContain('48 giờ');
    expect(bodyText).toContain('120 giờ');
    expect(bodyText).toContain('Tải hướng dẫn Word');

    const wordLink = page.locator('a.download-button[href="/downloads/huong-dan-qaqc.docx"]');
    await expect(wordLink).toBeVisible();
    await expect(wordLink).toBeEnabled();

    if (viewport.mobile) {
      await page.locator('.mobile-toc-button').click();
      const drawer = page.locator('.ant-drawer-content');
      await expect(drawer).toBeVisible();
      await expect(drawer.locator('.mobile-phase-button')).toHaveCount(2);
      const phase2Toggle = drawer.locator('.mobile-phase-toggle[aria-controls="mobile-phase-2-chapters"]');
      await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
      await phase2Toggle.click();
      await expect(drawer.locator('.mobile-toc-link.level-1')).toHaveCount(9);
      await expect(drawer.locator('.mobile-toc-link.level-2')).toHaveCount(31);
      const first = drawer.locator('.mobile-toc-link.level-2').nth(0);
      const firstText = await first.innerText();
      await first.click();
      await expect(drawer).toBeHidden();
      await assertCurrentTargetVisible(page);

      await page.locator('.mobile-toc-button').click();
      await drawer.locator('.mobile-toc-link.level-2').nth(1).click();
      await expect(drawer).toBeHidden();
      await page.goBack();
      await expect.poll(() => page.evaluate(() => location.hash)).not.toBe('');
      await assertCurrentTargetVisible(page);
      await page.locator('.mobile-toc-button').click();
      await expect(drawer.locator('.mobile-toc-link[aria-current="location"]')).toContainText(firstText);
      await page.keyboard.press('Escape');
    } else {
      const sidebar = page.locator('.guide-sidebar');
      await expect(sidebar.locator('.toc-phase-button')).toHaveCount(2);
      const phase2Toggle = sidebar.locator('.toc-phase-toggle[aria-controls="desktop-phase-2-chapters"]');
      await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
      await phase2Toggle.click();
      await expect(sidebar.locator('.toc-link.level-1')).toHaveCount(9);
      await expect(sidebar.locator('.toc-link.level-2')).toHaveCount(31);
      const first = sidebar.locator('.toc-link.level-2').nth(0);
      const firstText = await first.innerText();
      await first.click();
      await assertCurrentTargetVisible(page);
      await sidebar.locator('.toc-link.level-2').nth(1).click();
      await assertCurrentTargetVisible(page);
      await page.goBack();
      await expect(sidebar.locator('.toc-link[aria-current="location"]')).toContainText(firstText);
      await assertCurrentTargetVisible(page);
    }

    await assertNoOverflow(page);
    expect(wordRequests).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(badResponses).toEqual([]);
  });
}

test('navigation tolerates malformed hashes and keeps the phase root current', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/#%E0%A4%A`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('article#phase-1')).toBeVisible();
  await expect(page.locator('.guide-sidebar .toc-phase-button[aria-current="page"]')).toContainText('Phần 1');
  await expect(page.locator('.guide-sidebar .toc-link[aria-current="location"]')).toHaveCount(0);
  expect(pageErrors).toEqual([]);

  await page.goto(`${BASE_URL}/#phase-2`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('article#phase-2')).toBeVisible();
  await expect(page.locator('.guide-sidebar .toc-phase-button[aria-current="page"]')).toContainText('Phần 2');
  await expect(page.locator('.guide-sidebar .toc-link[aria-current="location"]')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test('active section stays shared across desktop, mobile, and manual scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/#phase-2`, { waitUntil: 'domcontentloaded' });
  await page.locator('.guide-sidebar .toc-phase-toggle[aria-controls="desktop-phase-2-chapters"]').click();

  const desktopTarget = page.locator('.guide-sidebar .toc-link.level-1', {
    hasText: '17. Kết quả bài chấm và xác nhận điểm',
  });
  await desktopTarget.click();
  await expect(desktopTarget).toHaveAttribute('aria-current', 'location');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-toc-button').click();
  const drawer = page.locator('.ant-drawer-content');
  await expect(drawer.locator('.mobile-toc-link[aria-current="location"]')).toContainText(
    '17. Kết quả bài chấm và xác nhận điểm',
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  await page.locator('#training-action-plan').evaluate((element) => {
    element.scrollIntoView({ block: 'start', behavior: 'auto' });
  });
  await expect.poll(async () =>
    page.locator('.mobile-toc-link[aria-current="location"]').textContent(),
  ).toContain('18. Action Plan Training');

  await page.locator('.mobile-toc-button').click();
  await expect(drawer.locator('.mobile-toc-link[aria-current="location"]')).toContainText(
    '18. Action Plan Training',
  );
});
test('current Word download is valid and legacy Word URLs remain 404', async ({ request }) => {
  const current = await request.get(`${BASE_URL}/downloads/huong-dan-qaqc.docx`);
  expect(current.status()).toBe(200);
  const currentBytes = await current.body();
  expect(currentBytes.length).toBeGreaterThan(100_000);
  expect(currentBytes.subarray(0, 2).toString('ascii')).toBe('PK');

  for (const fileName of [
    'huong-dan-su-dung-he-thong-qaqc-maycha-01-06-2026.docx',
    'huong-dan-su-dung-he-thong-qaqc-uat-27-05-2026.docx',
  ]) {
    expect((await request.get(`${BASE_URL}/downloads/${fileName}`)).status()).toBe(404);
  }

  const distFiles = readdirSync(join(process.cwd(), 'dist'), { recursive: true })
    .filter((file) => file.toString().toLowerCase().endsWith('.docx'))
    .map((file) => file.toString().replace(/\\/g, '/'));
  expect(distFiles).toEqual(['downloads/huong-dan-qaqc.docx']);
});
test('desktop phase roots start collapsed and child links restore accordion state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/#phase-2`, { waitUntil: 'domcontentloaded' });

  const sidebar = page.locator('.guide-sidebar');
  const phase1Toggle = sidebar.locator('.toc-phase-toggle[aria-controls="desktop-phase-1-chapters"]');
  const phase2Toggle = sidebar.locator('.toc-phase-toggle[aria-controls="desktop-phase-2-chapters"]');

  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(sidebar.locator('.toc-phase-children')).toHaveCount(0);
  await expect(page.locator('article#phase-2')).toBeVisible();

  await phase2Toggle.focus();
  await page.keyboard.press('Enter');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(sidebar.locator('#desktop-phase-2-chapters .toc-link.level-1')).toHaveCount(9);

  await phase2Toggle.focus();
  await page.keyboard.press('Enter');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(sidebar.locator('.toc-phase-children')).toHaveCount(0);

  await phase1Toggle.click();
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(sidebar.locator('#desktop-phase-1-chapters .toc-link.level-1')).toHaveCount(11);
  await expect(sidebar.locator('#desktop-phase-2-chapters')).toHaveCount(0);
  await expect(page.locator('article#phase-2')).toBeVisible();

  await sidebar.locator('#desktop-phase-1-chapters .toc-link.level-1').first().click();
  await expect(page.locator('article#phase-1')).toBeVisible();
  await expect(page).toHaveURL(/#tong-quan$/);
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'true');

  await page.goBack();
  await expect(page).toHaveURL(/#phase-2$/);
  await expect(page.locator('article#phase-2')).toBeVisible();
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');

  await page.goto(`${BASE_URL}/#training-result-list`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('article#phase-2')).toBeVisible();
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(sidebar.locator('.toc-link[aria-current="location"]')).toContainText('17.1. Danh sách kết quả');
});

test('mobile phase roots start collapsed and child links restore drawer accordion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/#phase-2`, { waitUntil: 'domcontentloaded' });
  await page.locator('.mobile-toc-button').click();

  const drawer = page.locator('.ant-drawer-content');
  const phase1Toggle = drawer.locator('.mobile-phase-toggle[aria-controls="mobile-phase-1-chapters"]');
  const phase2Toggle = drawer.locator('.mobile-phase-toggle[aria-controls="mobile-phase-2-chapters"]');

  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer.locator('.mobile-phase-children')).toHaveCount(0);

  await phase2Toggle.click();
  await expect(drawer).toBeVisible();
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer.locator('#mobile-phase-2-chapters .mobile-toc-link.level-1')).toHaveCount(9);

  await phase2Toggle.click();
  await expect(drawer).toBeVisible();
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer.locator('.mobile-phase-children')).toHaveCount(0);

  await phase1Toggle.click();
  await expect(drawer).toBeVisible();
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer.locator('#mobile-phase-1-chapters .mobile-toc-link.level-1')).toHaveCount(11);
  await expect(drawer.locator('#mobile-phase-2-chapters')).toHaveCount(0);

  await drawer.locator('#mobile-phase-1-chapters .mobile-toc-link.level-1').first().click();
  await expect(drawer).toBeHidden();
  await expect(page.locator('article#phase-1')).toBeVisible();
  await expect(page).toHaveURL(/#tong-quan$/);

  await page.goBack();
  await expect(page).toHaveURL(/#phase-2$/);
  await expect(page.locator('article#phase-2')).toBeVisible();
  await page.locator('.mobile-toc-button').click();
  await expect(drawer).toBeVisible();
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Escape');

  await page.goto(`${BASE_URL}/#training-result-list`, { waitUntil: 'domcontentloaded' });
  await page.locator('.mobile-toc-button').click();
  await expect(drawer).toBeVisible();
  await expect(phase2Toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(phase1Toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer.locator('.mobile-toc-link[aria-current="location"]')).toContainText('17.1. Danh sách kết quả');
});