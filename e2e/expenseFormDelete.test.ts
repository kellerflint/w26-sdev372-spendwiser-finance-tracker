import { test, expect } from '@playwright/test';

test('Walkthrough to Delete Transaction', async ({ page }) => {
    await page.goto('/');

    const category = 'Groceries';
    const amount = '100';
    const date = '2026-01-01';
    const description = 'E2E expense' + Date.now();

    await page.getByLabel('Category').selectOption({ label: category });
    await page.getByLabel('$ Spent').fill(amount);
    await page.getByLabel('Date').fill(date);
    await page.getByPlaceholder("What's the item for today?").fill(description);

    const elementLocation = page.locator('.history-item').filter({hasText: description})

    await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/expenses') && res.request().method() === 'POST'
        ),
        page.getByRole('button', { name: 'Add Expense' }).click()
    ]);
    await expect(elementLocation).toBeVisible({ timeout: 10000 });

    await elementLocation.getByRole('button', {name:'Delete'}).click()
    await expect(elementLocation).toHaveCount(0, { timeout: 10000 });
})