import { checkbox } from '@nextui-org/react';
import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.locator("xpath=//form[@id='login-form']/div/div/input").first().click();
  await page.locator("xpath=//form[@id='login-form']/div/div/input").first().fill('ParadiseKicksAdmin');
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('P@rAD1sEKicKSSh03s');
  await page.getByRole('button', { name: 'Log In' }).click();
});

test('delete a single product', async ({ page }) => {

  //Add a testing product "Delete Me" to be deleted so as not to delete from current database
  await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').fill('Delete Me');
  await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').fill('Delete Me');
  await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').fill('Delete Me');
  await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').fill('Delete Me');
  await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').fill('7');
  await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('9999');
  await page.getByRole('button', { name: '+' }).click();
  await page.getByText('Upload Image').click();
  await page.locator(".hidden").first().setInputFiles('tests/attachments/shoe.png');
  await page.getByRole('button', { name: 'Submit Item', exact: true }).click();

  //Go to delete tab and search "Delete" and delete the created "Delete Me"
  await page.getByRole('tab', { name: 'Delete' }).click();
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('Delete');
  await page.locator('div').filter({ hasText: /^Delete Me$/ }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Delete Selected' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

  //Check that prompt appears to show delete was successful
  await expect(page.getByText('Successfully submitted!')).toBeVisible();
  await expect(page.getByText('The products have been')).toBeVisible();

  //Close Delete Pop-up
  await page.getByRole('banner').getByRole('button').click();
});

test('delete multiple products', async ({ page }) => {

  //Add a testing product "Delete Me 1" to be deleted so as not to delete from current database
  await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').fill('Delete Me 1');
  await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').fill('Delete Me 1');
  await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').fill('Delete Me 1');
  await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').fill('Delete Me 1');
  await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').fill('7');
  await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('9999');
  await page.getByRole('button', { name: '+' }).click();
  await page.getByText('Upload Image').click();
  await page.locator(".hidden").first().setInputFiles('tests/attachments/shoe.png');
  await page.getByRole('button', { name: 'Submit Item', exact: true }).click();

  //Add another testing product "Delete Me 2" to be deleted so as not to delete from current database
  await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^SKU$/ }).nth(1).getByRole('textbox').fill('Delete Me 2');
  await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Model$/ }).getByRole('textbox').fill('Delete Me 2');
  await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Brand$/ }).getByRole('textbox').fill('Delete Me 2');
  await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Colorway$/ }).getByRole('textbox').fill('Delete Me 2');
  await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Size$/ }).getByRole('textbox').fill('7');
  await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').click(); 
  await page.locator('div').filter({ hasText: /^Price$/ }).getByRole('textbox').fill('9999');
  await page.getByRole('button', { name: '+' }).click();
  await page.getByText('Upload Image').click();
  await page.locator(".hidden").first().setInputFiles('tests/attachments/shoe.png');
  await page.getByRole('button', { name: 'Submit Item', exact: true }).click();

  //Go to delete tab and search "Delete" and delete the created "Delete Me 1" and "Delete Me 2"
  await page.getByRole('tab', { name: 'Delete' }).click();
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('Delete');
  await page.locator('div').filter({ hasText: /^Delete Me 1$/ }).getByRole('checkbox').click();
  await page.locator('div').filter({ hasText: /^Delete Me 2$/ }).getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Delete Selected' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

  //Check that the multiple prompts appears to show delete was successful
  await expect(page.getByText('Successfully submitted!').nth(0)).toBeVisible();
  await expect(page.getByText('The products have been').nth(0)).toBeVisible();
  await expect(page.getByText('Successfully submitted!').nth(1)).toBeVisible();
  await expect(page.getByText('The products have been').nth(1)).toBeVisible();
  

  //Close Delete Pop-up
  await page.getByRole('banner').getByRole('button').click();
});

