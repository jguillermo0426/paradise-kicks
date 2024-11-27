import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.locator("xpath=//form[@id='login-form']/div/div/input").first().click();
  await page.locator("xpath=//form[@id='login-form']/div/div/input").first().fill('ParadiseKicksAdmin');
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('P@rAD1sEKicKSSh03s');
  await page.getByRole('button', { name: 'Log In' }).click();
});


test.describe('Add Item', () => {
  test('add a single product', async ({ page }) => {
    // fill up fields
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').click(); // SKU Field
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').fill('SKU Add Test');
    await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').click(); // Model Field
    await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').fill('Model Add Test');
    await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').click(); // Brand Field
    await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').fill('Brand Add Test');
    await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').click(); // Colorway Field
    await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').fill('Colorway Add Test');
    await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').click(); // Size Field
    await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').fill('6.5');
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click(); // Price Field
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('9999');
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByText('Upload Image').click();
    await page.locator(".hidden").first().setInputFiles('tests/attachments/shoe.png');
    await page.getByRole('button', { name: 'Submit Item', exact: true }).click();
    
    
    // Assert
    await expect(page.getByText('Successfully submitted!')).toBeVisible();
    await expect(page.getByText('The products have been')).toBeVisible();
    await page.reload();
    
    // Delete added product to maintain database cleanliness
    await page.getByRole('tab', { name: 'Delete' }).click();
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('SKU Add Test');
    await page.locator('div').filter({ hasText: /^SKU Add Test$/ }).getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Delete Selected' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Successfully submitted!')).toBeVisible();
    await expect(page.getByText('The products have been')).toBeVisible();
  });

  test('add a single product but leaving a field blank', async ({ page }) => {
    // fill-up fields except for adding an image
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').click(); // SKU Field
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').fill('SKU New Test 2');
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
    await page.getByRole('button', { name: 'Submit Item', exact: true }).click();

    // Assert
    await expect(page.getByText('No image uploaded')).toBeVisible();
  });
});


    
    
