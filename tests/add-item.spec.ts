import { test, expect } from '@playwright/test';

test.beforeEach('adding a single product', async ({ page }) => {
    await page.goto('http://localhost:3000/admin-dashboard/inventory');
    await page.goto('http://localhost:3000/login');
    await page.locator('#login-form > div').first().click();
    await page.locator('#login-form > div').first().fill('ParadiseKicksAdmin');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('P@rAD1sEKicKSSh03s');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').click(); // SKU Field
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').fill('SKU Test');
    await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').click(); // Model Field
    await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').fill('Model Test');
    await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').click(); // Brand Field
    await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').fill('Brand Test');
    await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').click(); // Colorway Field
    await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').fill('Colorway Test');
    await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').click(); // Size Field
    await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').fill('6.5');
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click(); // Price Field
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('9999');
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByText('Upload Image').click();
    await page.getByText('InventoryOrdersBrandsFAQsFeedbackLogoutAdd').setInputFiles('blank.png');
    await page.getByRole('button', { name: 'Submit Item', exact: true }).click();
    await expect(page.getByText('Successfully submitted!')).toBeVisible();
    await expect(page.getByText('The products have been')).toBeVisible();
    await expect(page.locator('#mantine-8vabrn4lb')).toBeVisible();
  });

