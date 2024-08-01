import { test, expect } from '@playwright/test';

const UI_URL="http://localhost:5173/";

test('should not allow the user to sign in', async ({ page }) => {
await page.goto(UI_URL);

//get the sign in button
await page.getByRole("link", {name:"Sign In"}).click();

await expect(page.getByRole("heading", {name:"Sign In"})).toBeVisible();

await page.locator("[name=email]").fill('vikal12@gmail.com');
await page.locator("[name=password]").fill("password");

await page.getByRole("button", {name:"Login"}).click();

await expect(page.getByText("Sign in Successful!")).toBeVisible();


});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
