import { test, expect } from '@playwright/test';

test('expense form submission', async ({ page }) => {
  await page.goto('/');

  const category = 'Groceries';
  const amount = '100';
  const date = '2026-01-01';
  const description = 'E2E expense' + Date.now();
  const formattedDate = new Date(date).toLocaleDateString();

  await page.getByLabel('Category').selectOption({ label: category });
  await page.getByLabel('$ Spent').fill(amount);
  await page.getByLabel('Date').fill(date);
  await page.getByPlaceholder("What's the item for today?").fill(description);

  await page.getByRole('button', { name: 'Add Expense' }).click();

  await expect(page.locator('.history-item').filter({ hasText: description }))
  .toBeVisible({ timeout: 10000 });

  const newExpenseRow = page.locator('.history-item').filter({ hasText: description });
  
  await expect(async () => {
    const items = await page.locator('.history-item').allTextContents();
    expect(items.join(' ')).toContain(description);
  }).toPass({ timeout: 15000 });

  await expect(newExpenseRow).toContainText('groceries');
  await expect(newExpenseRow).toContainText('$100');
  await expect(newExpenseRow).toContainText(formattedDate);
});

