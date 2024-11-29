import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.locator("xpath=//form[@id='login-form']/div/div/input").first().click();
  await page.locator("xpath=//form[@id='login-form']/div/div/input").first().fill('ParadiseKicksAdmin');
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('P@rAD1sEKicKSSh03s');
  await page.getByRole('button', { name: 'Log In' }).click();
  // await page.getByRole('tab', { name: 'Edit' }).click();
});

test.describe('Edit Item', () => {
  test("edit a single product's model, brand, and colorway", async ({ page }) => {
    // set-up test by adding a test product to edit
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').click(); // SKU Field
    await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').fill('SKU Edit Test');
    await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').click(); // Model Field
    await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').fill('Model Edit Test');
    await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').click(); // Brand Field
    await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').fill('Brand Edit Test');
    await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').click(); // Colorway Field
    await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').fill('Colorway Edit Test');
    await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').click(); // Size Field
    await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').fill('8.5');
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click(); // Price Field
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('1000');
    await page.getByRole('button', { name: '+' }).click();
    await page.getByText('Upload Image').click();
    await page.locator(".hidden").first().setInputFiles('tests/attachments/shoe.png');
    await page.getByRole('button', { name: 'Submit Item', exact: true }).click();
    
    await expect(page.getByText('Successfully submitted!')).toBeVisible();
    await expect(page.getByText('The products have been')).toBeVisible();
    await page.reload();

    // fill up for edit
    await page.getByRole('tab', { name: 'Edit' }).click();
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('Model');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(0).click(); // Model Field
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(0).fill('');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(0).fill('Model Edited');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(1).click(); // Brand Field
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(1).fill('');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(1).fill('Brand Edited');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(2).click(); // Colorway Field
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(2).fill('');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(2).fill('Colorway Edited');
    await page.getByRole('button', { name: 'Save Edited Items', exact: true }).click();
    
    // Assert
    await expect(page.getByText('Successfully submitted!')).toBeVisible();
    await expect(page.getByText('The products have been successfully submitted.')).toBeVisible();
  });
});

  test.describe('Edit Item', () => {
    test("edit a single product's Size, prize, and stock", async ({ page }) => {
      // fill up for edit
      await page.getByRole('tab', { name: 'Edit' }).click();
      await page.getByPlaceholder('Search').click();
      await page.getByPlaceholder('Search').fill('Model');
      await page.getByRole('button', { name: 'See Stock' }).nth(0).click()
      await page.getByRole('main').getByRole('textbox').nth(0).click();
      await page.getByRole('main').getByRole('textbox').nth(0).fill('');
      await page.getByRole('main').getByRole('textbox').nth(0).fill('US 8');
      await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click();
      await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('9000');
      await page.getByRole('button', { name: '+' }).click()
      await page.getByRole('banner').getByRole('button').click()
    });
});

test.describe('Edit Invalid Item', () => {
  test("invalid edit a single product's Size, prize, and stock", async ({ page }) => {
    // fill up for edit
    await page.getByRole('tab', { name: 'Edit' }).click();
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('Model');
    await page.getByRole('button', { name: 'See Stock' }).nth(0).click()
    await page.getByRole('main').getByRole('textbox').nth(0).click();
    await page.getByRole('main').getByRole('textbox').nth(0).fill('');
    await page.getByRole('main').getByRole('textbox').nth(0).fill('0');
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('');
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('banner').getByRole('button').click()
  });

});

test.describe('Edit Invalid Item', () => {
  test("edit a single product's model, brand, and colorway", async ({ page }) => {
    await page.getByRole('tab', { name: 'Edit' }).click();
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('Model');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(0).click(); // Model Field
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(0).fill('');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(1).click(); // Brand Field
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(1).fill('');
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(2).click(); // Colorway Field
    await page.locator('div').filter({ hasText: /^Total Stock1Edit ImageModelBrandColorway:See Stock$/ }).getByRole('textbox').nth(2).fill('');
    await page.getByRole('button', { name: 'Save Edited Items', exact: true }).click();
    
    // Assert
    await expect(page.getByText('Missing required field: Model')).toBeVisible();
  });
});

test.describe('Clean added product', () => {
  test('Delete added product', async ({ page }) => {
    await page.getByRole('tab', { name: 'Delete' }).click();
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('SKU');
    await page.locator('div').filter({ hasText: /^SKU Edit Test$/ }).getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Delete Selected' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    //Check that prompt appears to show delete was successful
    await expect(page.getByText('Successfully submitted!')).toBeVisible();
    await expect(page.getByText('The products have been')).toBeVisible();
});
});